import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class PropertiesService {
  // ── 매물 등록 ─────────────────────────────────
  async create(sellerId: string, dto: {
    apartment_name: string;
    address: string;
    address_road?: string;
    dong?: string;
    ho?: string;
    area: number;
    floor: number;
    total_floors?: number;
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

    if (userRole === 'agent') {
      const { data: myBid } = await supabaseClient
        .from('bids')
        .select('*')
        .eq('property_id', propertyId)
        .eq('agent_id', userId)
        .single();
      return { ...property, my_bid: myBid };
    }

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
    auctionEndAt.setDate(auctionEndAt.getDate() + 3);

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

    await supabaseClient
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId);

    await supabaseClient
      .from('bids')
      .update({ status: 'rejected' })
      .eq('property_id', propertyId)
      .neq('id', bidId);

    const { data: bid } = await supabaseClient
      .from('bids')
      .select('agent_id, commission_rate')
      .eq('id', bidId)
      .single();

    await supabaseClient
      .from('properties')
      .update({ status: 'matched', selected_agent_id: bid.agent_id })
      .eq('id', propertyId);

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

  // ── 아파트 단지명 검색 (Kakao Local API 프록시) ─
  async searchApartment(query: string): Promise<any[]> {
    const key = process.env.KAKAO_REST_API_KEY;
    if (!key || !query || query.trim().length < 2) return [];

    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query + ' 아파트')}&size=10`;
      const res = await fetch(url, {
        headers: { Authorization: `KakaoAK ${key}` },
      });
      if (!res.ok) return [];
      const json = (await res.json()) as any;
      return (json.documents || [])
        .slice(0, 8)
        .map((d: any) => ({
          id: d.id,
          name: d.place_name,
          address: d.road_address_name || d.address_name,
          jibun_address: d.address_name,
          category: d.category_name,
          x: d.x,
          y: d.y,
        }));
    } catch {
      return [];
    }
  }

  // ── 인증 서류 업로드 (Supabase Storage) ────────
  async uploadVerificationDoc(
    propertyId: string,
    sellerId: string,
    file: Express.Multer.File,
  ) {
    const { data: property } = await supabaseClient
      .from('properties')
      .select('id, seller_id')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');
    if (property.seller_id !== sellerId) throw new ForbiddenException('권한이 없습니다.');

    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_가-힣]/g, '_');
    const filePath = `${propertyId}/${Date.now()}_${safeFileName}`;

    const { data, error } = await supabaseClient.storage
      .from('verification-docs')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error('파일 업로드에 실패했습니다: ' + error.message);

    // verification-docs는 private 버킷 → signed URL 생성 (1시간)
    const { data: signedData } = await supabaseClient.storage
      .from('verification-docs')
      .createSignedUrl(data.path, 3600);

    return {
      path: data.path,
      url: signedData?.signedUrl ?? '',
    };
  }

  // ── 소유 인증 신청 제출 ──────────────────────
  async submitVerification(
    propertyId: string,
    sellerId: string,
    dto: {
      owner_name: string;
      owner_phone: string;
      doc_paths?: string[];
    },
  ) {
    const { data: property } = await supabaseClient
      .from('properties')
      .select('id, seller_id, apartment_name, address, status')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');
    if (property.seller_id !== sellerId) throw new ForbiddenException('권한이 없습니다.');

    // 이미 인증됐거나 진행중인 경우
    if (!['pending_verification'].includes(property.status)) {
      throw new ForbiddenException('이미 인증이 완료되었거나 진행 중인 매물입니다.');
    }

    // 서류 경로 저장
    if (dto.doc_paths?.length) {
      await supabaseClient
        .from('properties')
        .update({ documents: dto.doc_paths })
        .eq('id', propertyId);
    }

    // 어드민 전체에게 알림
    const { data: admins } = await supabaseClient
      .from('users')
      .select('id')
      .eq('role', 'admin');

    for (const admin of admins || []) {
      await supabaseClient.from('notifications').insert({
        user_id: admin.id,
        type: 'verification_request',
        title: '📋 소유 인증 신청',
        body: `${dto.owner_name}(${dto.owner_phone})님이 [${property.apartment_name}] 소유 인증을 신청했습니다.`,
        data: { property_id: propertyId, apartment_name: property.apartment_name },
        is_read: false,
      });
    }

    return {
      message: '소유 인증 서류가 제출되었습니다. 1-2 영업일 내에 처리됩니다.',
      property_id: propertyId,
    };
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

      const newStatus = (count || 0) > 0 ? 'selection_pending' : 'no_bids';
      await supabaseClient
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);
    }

    console.log(`🏠 [스케줄러] 만료 경매 ${expired.length}건 마감 처리`);
  }
}
