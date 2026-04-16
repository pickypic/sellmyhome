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

  // ── 건축물대장 API 소유권 자동 확인 ──────────────
  async checkOwnership(propertyId: string, userId: string): Promise<{
    verified: boolean;
    auto: boolean;
    reason?: string;
    building_info?: { owner_name?: string; build_year?: string; area?: string; building_name?: string };
  }> {
    // 1. 매물 및 사용자 정보 조회
    const { data: property } = await supabaseClient
      .from('properties')
      .select('id, seller_id, apartment_name, address, address_road, dong, ho, status')
      .eq('id', propertyId)
      .single();

    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');
    if (property.seller_id !== userId) throw new ForbiddenException('권한이 없습니다.');

    if (property.status === 'verified') {
      return { verified: true, auto: false, reason: '이미 인증된 매물입니다.' };
    }

    const { data: user } = await supabaseClient
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const serviceKey = process.env.PUBLIC_DATA_API_KEY;
    if (!serviceKey) {
      return { verified: false, auto: false, reason: '자동 인증 서비스를 사용할 수 없습니다. 서류를 직접 제출해주세요.' };
    }

    // 2. 주소 준비 (지번주소 우선, 없으면 도로명)
    const address = property.address || property.address_road || '';
    if (!address) {
      return { verified: false, auto: false, reason: '주소 정보가 없습니다.' };
    }

    try {
      // 3. 건축물대장 API 호출
      const apiUrl = `https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo` +
        `?serviceKey=${serviceKey}` +
        `&platPlc=${encodeURIComponent(address)}` +
        `&numOfRows=10&pageNo=1&_type=json`;

      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        return { verified: false, auto: false, reason: '건축물대장 조회 서비스에 일시적으로 접근할 수 없습니다.' };
      }

      const json = (await res.json()) as any;
      const rawItems = json?.response?.body?.items?.item;

      if (!rawItems) {
        return {
          verified: false,
          auto: false,
          reason: '해당 주소의 건축물대장 정보를 찾을 수 없습니다. 주소를 확인하거나 서류를 직접 제출해주세요.',
        };
      }

      const items: any[] = Array.isArray(rawItems) ? rawItems : [rawItems];

      // 4. 소유자명 추출 (ownerNm 필드)
      const ownerNames: string[] = items
        .map((it: any) => (it.ownerNm ?? '').trim())
        .filter((n: string) => n.length > 0);

      // 건물 기본 정보 추출 (최초 항목 기준)
      const first = items[0];
      const buildingInfo = {
        owner_name: ownerNames[0],
        build_year: first?.useAprDay ? String(first.useAprDay).slice(0, 4) : undefined,
        area: first?.totArea ? String(first.totArea) : undefined,
        building_name: first?.bldNm || property.apartment_name,
      };

      // 5. 이름 비교 (공백 제거 후 비교)
      const userName = user.name.replace(/\s/g, '');
      const matched = ownerNames.some(
        (name) => name.replace(/\s/g, '') === userName,
      );

      if (matched) {
        // 자동 인증 성공 → 상태 변경
        await supabaseClient
          .from('properties')
          .update({ status: 'verified' })
          .eq('id', propertyId);

        // 알림: 어드민에게 자동 인증 완료 통보
        const { data: admins } = await supabaseClient
          .from('users').select('id').eq('role', 'admin');
        for (const admin of admins || []) {
          await supabaseClient.from('notifications').insert({
            user_id: admin.id,
            type: 'verification_auto',
            title: '✅ 자동 소유 인증 완료',
            body: `${user.name}님의 [${property.apartment_name}] 건축물대장 자동 인증이 완료되었습니다.`,
            data: { property_id: propertyId },
            is_read: false,
          });
        }

        return { verified: true, auto: true, building_info: buildingInfo };
      }

      // 6. 소유자 없거나 이름 불일치
      if (ownerNames.length === 0) {
        return {
          verified: false,
          auto: false,
          building_info: buildingInfo,
          reason: '건축물대장에서 소유자 정보를 확인할 수 없습니다 (아파트 집합건물의 경우 호별 소유자는 등기부등본으로만 확인됩니다). 서류를 직접 제출해주세요.',
        };
      }

      return {
        verified: false,
        auto: false,
        building_info: buildingInfo,
        reason: `건축물대장 소유자(${ownerNames.join(', ')})와 회원 이름(${user.name})이 일치하지 않습니다. 이름 변경이나 공동 소유의 경우 서류를 제출해주세요.`,
      };
    } catch (err: any) {
      if (err.name === 'TimeoutError') {
        return { verified: false, auto: false, reason: '건축물대장 조회 서비스 응답 시간이 초과되었습니다. 잠시 후 다시 시도하거나 서류를 제출해주세요.' };
      }
      console.error('[건축물대장 API 오류]', err?.message);
      return { verified: false, auto: false, reason: '자동 인증 중 오류가 발생했습니다. 서류를 직접 제출해주세요.' };
    }
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
