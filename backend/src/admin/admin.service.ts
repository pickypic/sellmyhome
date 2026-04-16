import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class AdminService {
  private assertAdmin(role: string) {
    if (role !== 'admin') throw new ForbiddenException('관리자만 접근할 수 있습니다.');
  }

  // ── 통계 대시보드 ─────────────────────────────────────────────────────────
  async getStats(adminRole: string) {
    this.assertAdmin(adminRole);

    const [
      { count: totalUsers },
      { count: totalSellers },
      { count: totalAgents },
      { count: blockedUsers },
      { count: openAuctions },
      { count: totalProperties },
      { count: completedTx },
      { count: pendingVerifications },
      { data: pointSum },
    ] = await Promise.all([
      supabaseClient.from('users').select('*', { count: 'exact', head: true }),
      supabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
      supabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('role', 'agent'),
      supabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('is_active', false),
      supabaseClient.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'auction_open'),
      supabaseClient.from('properties').select('*', { count: 'exact', head: true }),
      supabaseClient.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseClient.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending_verification'),
      supabaseClient.from('point_transactions').select('amount').eq('type', 'purchase'),
    ]);

    const totalRevenue = (pointSum || []).reduce((s: number, r: any) => s + (r.amount || 0), 0);

    return {
      users: { total: totalUsers, sellers: totalSellers, agents: totalAgents, blocked: blockedUsers },
      properties: { total: totalProperties, open_auctions: openAuctions, pending_verifications: pendingVerifications },
      transactions: { completed: completedTx },
      revenue: { total_points_purchased: totalRevenue },
    };
  }

  // ── 회원 목록 (검색/필터/페이지네이션) ───────────────────────────────────
  async getUsers(adminRole: string, query: {
    search?: string; role?: string; is_active?: string; page?: number; limit?: number;
  }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    let q = supabaseClient
      .from('users')
      .select('id, email, name, phone, role, is_active, is_verified, point_balance, subscription_tier, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (query.search) q = q.or(`email.ilike.%${query.search}%,name.ilike.%${query.search}%`);
    if (query.role) q = q.eq('role', query.role);
    if (query.is_active !== undefined) q = q.eq('is_active', query.is_active === 'true');

    const { data, count, error } = await q;
    if (error) throw new BadRequestException(error.message);

    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 회원 상세 ─────────────────────────────────────────────────────────────
  async getUser(adminRole: string, userId: string) {
    this.assertAdmin(adminRole);

    const { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const [{ data: agentProfile }, { data: actions }, { data: pointHistory }] = await Promise.all([
      supabaseClient.from('agent_profiles').select('*').eq('user_id', userId).single(),
      supabaseClient.from('admin_actions').select('*').eq('target_id', userId).order('created_at', { ascending: false }).limit(10),
      supabaseClient.from('point_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    ]);

    return { ...user, agent_profile: agentProfile, admin_actions: actions || [], point_history: pointHistory || [] };
  }

  // ── 회원 차단 / 해제 ──────────────────────────────────────────────────────
  async blockUser(adminRole: string, adminId: string, userId: string, reason: string) {
    this.assertAdmin(adminRole);

    const { data: user } = await supabaseClient.from('users').select('id').eq('id', userId).single();
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    await supabaseClient.from('users').update({ is_active: false }).eq('id', userId);
    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: userId, action_type: 'ban', reason });

    return { message: '사용자가 차단되었습니다.' };
  }

  async unblockUser(adminRole: string, adminId: string, userId: string) {
    this.assertAdmin(adminRole);

    await supabaseClient.from('users').update({ is_active: true }).eq('id', userId);
    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: userId, action_type: 'restore', reason: '차단 해제' });

    return { message: '차단이 해제되었습니다.' };
  }

  // ── 포인트 지급 / 차감 ────────────────────────────────────────────────────
  async adjustPoints(adminRole: string, adminId: string, userId: string, dto: { amount: number; reason: string }) {
    this.assertAdmin(adminRole);
    if (dto.amount === 0) throw new BadRequestException('변경 포인트는 0이 될 수 없습니다.');

    const { data: user } = await supabaseClient.from('users').select('id, point_balance').eq('id', userId).single();
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const newBalance = (user.point_balance || 0) + dto.amount;
    if (newBalance < 0) throw new BadRequestException('포인트 잔액이 부족합니다.');

    await supabaseClient.from('users').update({ point_balance: newBalance }).eq('id', userId);
    await supabaseClient.from('point_transactions').insert({
      user_id: userId,
      amount: dto.amount,
      type: dto.amount > 0 ? 'bonus' : 'refund',
      description: `[관리자] ${dto.reason}`,
      ref_id: `admin_${adminId}`,
      balance: newBalance,
    });

    // 포인트 지급/차감 알림 생성
    const isGrant = dto.amount > 0;
    await supabaseClient.from('notifications').insert({
      user_id: userId,
      type: 'point_grant',
      title: isGrant ? `포인트 ${dto.amount.toLocaleString()}P 지급` : `포인트 ${Math.abs(dto.amount).toLocaleString()}P 차감`,
      body: `사유: ${dto.reason} | 현재 잔액: ${newBalance.toLocaleString()}P`,
      data: { amount: dto.amount, balance: newBalance, reason: dto.reason },
      is_read: false,
    });

    return { message: '포인트가 조정되었습니다.', new_balance: newBalance };
  }

  // ── 매물 전체 목록 ────────────────────────────────────────────────────────
  async getProperties(adminRole: string, query: { status?: string; search?: string; page?: number; limit?: number }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    let q = supabaseClient
      .from('properties')
      .select('id, apartment_name, address, area, asking_price, status, auction_end_at, created_at, seller:users!seller_id(id, name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (query.status) q = q.eq('status', query.status);
    if (query.search) q = q.or(`apartment_name.ilike.%${query.search}%,address.ilike.%${query.search}%`);

    const { data, count } = await q;
    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 거래 전체 목록 ────────────────────────────────────────────────────────
  async getTransactions(adminRole: string, query: { status?: string; page?: number; limit?: number }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    let q = supabaseClient
      .from('transactions')
      .select(`
        id, status, commission_rate, agreed_price, created_at,
        property:properties(id, apartment_name, address),
        seller:users!seller_id(id, name),
        agent:users!agent_id(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (query.status) q = q.eq('status', query.status);

    const { data, count } = await q;
    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 포인트 결제 내역 전체 ─────────────────────────────────────────────────
  async getPointTransactions(adminRole: string, query: { type?: string; user_id?: string; page?: number; limit?: number }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    let q = supabaseClient
      .from('point_transactions')
      .select('id, amount, type, description, ref_id, balance, created_at, user:users!user_id(id, name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (query.type) q = q.eq('type', query.type);
    if (query.user_id) q = q.eq('user_id', query.user_id);

    const { data, count } = await q;
    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 입찰 전체 목록 ────────────────────────────────────────────────────────
  async getBids(adminRole: string, query: { status?: string; page?: number; limit?: number }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    let q = supabaseClient
      .from('bids')
      .select(`
        id, commission_rate, status, created_at,
        property:properties(id, apartment_name, address),
        agent:users!agent_id(id, name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (query.status) q = q.eq('status', query.status);

    const { data, count } = await q;
    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 리뷰 전체 목록 ────────────────────────────────────────────────────────
  async getReviews(adminRole: string, query: { page?: number; limit?: number }) {
    this.assertAdmin(adminRole);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;

    const { data, count } = await supabaseClient
      .from('reviews')
      .select(`
        id, rating, content, is_verified, created_at,
        reviewer:users!reviewer_id(id, name),
        agent:users!agent_id(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    return { data: data || [], total: count || 0, page, limit };
  }

  // ── 리뷰 삭제 ─────────────────────────────────────────────────────────────
  async deleteReview(adminRole: string, reviewId: string) {
    this.assertAdmin(adminRole);

    const { error } = await supabaseClient.from('reviews').delete().eq('id', reviewId);
    if (error) throw new BadRequestException(error.message);

    return { message: '리뷰가 삭제되었습니다.' };
  }

  // ── 인증 심사 대기 목록 ───────────────────────────────────────────────────
  async getPendingVerifications(adminRole: string) {
    this.assertAdmin(adminRole);

    const [{ data: properties }, { data: agents }] = await Promise.all([
      supabaseClient
        .from('properties')
        .select('id, apartment_name, address, created_at, seller:users!seller_id(id, name, phone)')
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: true }),

      supabaseClient
        .from('agent_profiles')
        .select('user_id, license_number, office_name, region_gu, career_years, is_license_verified, created_at, user:users!user_id(id, name, phone, email)')
        .eq('is_license_verified', false)
        .order('created_at', { ascending: true }),
    ]);

    return { pending_properties: properties || [], pending_agents: agents || [] };
  }

  // ── 매물 소유 인증 승인 ───────────────────────────────────────────────────
  async approvePropertyVerification(propertyId: string, adminId: string, adminRole: string) {
    this.assertAdmin(adminRole);

    const { data: property } = await supabaseClient.from('properties').select('status').eq('id', propertyId).single();
    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');

    await supabaseClient.from('properties').update({ status: 'verified' }).eq('id', propertyId);
    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: propertyId, action_type: 'restore', reason: '매물 소유 인증 승인' });

    return { message: '승인되었습니다.' };
  }

  // ── 매물 소유 인증 거절 ───────────────────────────────────────────────────
  async rejectPropertyVerification(propertyId: string, adminId: string, adminRole: string, dto: { reason: string }) {
    this.assertAdmin(adminRole);

    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: propertyId, action_type: 'warning', reason: dto.reason });
    return { message: '거절되었습니다.' };
  }

  // ── 중개사 자격 인증 승인 ─────────────────────────────────────────────────
  async approveAgentVerification(agentId: string, adminId: string, adminRole: string) {
    this.assertAdmin(adminRole);

    await supabaseClient.from('agent_profiles').update({ is_license_verified: true }).eq('user_id', agentId);
    await supabaseClient.from('users').update({ is_verified: true }).eq('id', agentId);
    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: agentId, action_type: 'restore', reason: '중개사 자격 인증 승인' });

    return { message: '승인되었습니다.' };
  }

  // ── 중개사 자격 인증 거절 ─────────────────────────────────────────────────
  async rejectAgentVerification(agentId: string, adminId: string, adminRole: string, dto: { reason: string }) {
    this.assertAdmin(adminRole);

    await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: agentId, action_type: 'warning', reason: dto.reason });
    return { message: '거절되었습니다.' };
  }

  // ── 사용자 제재 ───────────────────────────────────────────────────────────
  async sanctionUser(targetUserId: string, adminId: string, adminRole: string, dto: { action_type: 'warning' | 'suspend' | 'ban' | 'restore'; reason: string; expires_at?: string }) {
    this.assertAdmin(adminRole);

    if (dto.action_type === 'ban' || dto.action_type === 'suspend') {
      await supabaseClient.from('users').update({ is_active: false }).eq('id', targetUserId);
    } else if (dto.action_type === 'restore') {
      await supabaseClient.from('users').update({ is_active: true }).eq('id', targetUserId);
    }

    const { data } = await supabaseClient.from('admin_actions').insert({ admin_id: adminId, target_id: targetUserId, ...dto }).select().single();
    return data;
  }
}
