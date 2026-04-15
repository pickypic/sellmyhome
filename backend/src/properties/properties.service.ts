import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class PropertiesService {
  // ── 매물 등록 ─────────────────────────────────
  async create(sellerId: string, dto: {
    apartment_name: string;
    address: string;
    dong?: string;
    ho?: string;
    area: number;
    floor: number;
    direction?: string;
    build_year?: number;
    asking_price: number;
    description?: string;
    images?: string[];
  }) {
    const { data, error } = await supabaseClient
      .from('properties')
      .insert({
        seller_id: sellerId,
        ...dto,
        status: 'pending_verification', // 소유 인증 대기
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ── 내 매물 목록 (매도자용) ───────────────────
  async findMySeller(sellerId: string) {
    const { data } = await supabaseClient
      .from('properties')
      .select('*, bids(count)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    return data;
  }

  // ── 역경매 오픈 매물 목록 (중개사용) ─────────
  async findOpenAuctions(agentId: string) {
    // 해당 중개사가 이미 입찰한 매물 제외
    const { data: myBids } = await supabaseClient
      .from('bids')
      .select('property_id')
      .eq('agent_id', agentId);

    const biddedIds = myBids?.map((b) => b.property_id) || [];

    const query = supabaseClient
      .from('properties')
      .select('id, apartment_name, address, area, asking_price, floor, direction, auction_end_at, bids(count)')
      .eq('status', 'auction_open')
      .gt('auction_end_at', new Date().toISOString())
      .order('auction_end_at', { ascending: true });

    if (biddedIds.length > 0) {
      query.not('id', 'in', `(${biddedIds.join(',')})`);
    }

    const { data } = await query;
    return data;
  }

  // ── 매물 상세 조회 ───────────────────────────
  async findOne(propertyId: string, userId: string, userRole: string) {
    const { data: property } = await supabaseClient
      .from('properties')
      .select('*, seller:users!seller_id(id, name, phone)')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');

    // 중개사는 경매 기간 중 다른 중개사 입찰 내용 비공개
    if (userRole === 'agent') {
      const { data: myBid } = await supabaseClient
        .from('bids')
        .select('*')
        .eq('property_id', propertyId)
        .eq('agent_id', userId)
        .single();
      return { ...property, my_bid: myBid };
    }

    // 매도자는 모든 입찰 열람 가능
    if (userRole === 'seller' && property.seller_id === userId) {
      const { data: bids } = await supabaseClient
        .from('bids')
        .select('*, agent:users!agent_id(id, name, profile_image, license_number, avg_rating, review_count)')
        .eq('property_id', propertyId)
        .order('commission_rate', { ascending: true });
      return { ...property, bids };
    }

    return property;
  }

  // ── 역경매 시작 (소유 인증 완료 후) ──────────
  async startAuction(propertyId: string, sellerId: string) {
    const { data: property } = await supabaseClient
      .from('properties')
      .select('seller_id, status')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException();
    if (property.seller_id !== sellerId) throw new ForbiddenException();
    if (property.status !== 'verified') throw new ForbiddenException('소유 인증 후 경매를 시작할 수 있습니다.');

    const auctionEndAt = new Date();
    auctionEndAt.setDate(auctionEndAt.getDate() + 3); // 3일 비공개 역경매

    const { data } = await supabaseClient
      .from('properties')
      .update({ status: 'auction_open', auction_end_at: auctionEndAt.toISOString() })
      .eq('id', propertyId)
      .select()
      .single();

    return data;
  }

  // ── 중개사 선택 (매도자가 입찰 수락) ─────────
  async selectAgent(propertyId: string, bidId: string, sellerId: string) {
    const { data: property } = await supabaseClient
      .from('properties')
      .select('seller_id, status')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException();
    if (property.seller_id !== sellerId) throw new ForbiddenException();

    // 선택된 입찰 수락
    await supabaseClient
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId);

    // 나머지 입찰 거절
    await supabaseClient
      .from('bids')
      .update({ status: 'rejected' })
      .eq('property_id', propertyId)
      .neq('id', bidId);

    // 매물 상태 변경
    const { data: bid } = await supabaseClient
      .from('bids')
      .select('agent_id, commission_rate')
      .eq('id', bidId)
      .single();

    await supabaseClient
      .from('properties')
      .update({ status: 'matched', selected_agent_id: bid.agent_id })
      .eq('id', propertyId);

    // 거래 생성
    const { data: transaction } = await supabaseClient
      .from('transactions')
      .insert({
        property_id: propertyId,
        seller_id: sellerId,
        agent_id: bid.agent_id,
        commission_rate: bid.commission_rate,
        status: 'contract_pending',
      })
      .select()
      .single();

    return transaction;
  }

  // ── 스케줄러: 만료된 경매 자동 마감 (매시간) ─
  @Cron(CronExpression.EVERY_HOUR)
  async closeExpiredAuctions() {
    const { data: expired } = await supabaseClient
      .from('properties')
      .select('id')
      .eq('status', 'auction_open')
      .lt('auction_end_at', new Date().toISOString());

    if (!expired?.length) return;

    for (const property of expired) {
      const { count } = await supabaseClient
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', property.id);

      // 입찰 없으면 재경매 대기, 있으면 선택 대기로
      const newStatus = (count || 0) > 0 ? 'selection_pending' : 'no_bids';
      await supabaseClient
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);
    }

    console.log(`🏠 [스케줄러] 만료 경매 ${expired.length}건 마감 처리`);
  }
}
