import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class BidsService {
  // ── 입찰 제출 (중개사) ────────────────────────
  async create(agentId: string, dto: {
    property_id: string;
    commission_rate: number; // 수수료율 (%)
    message: string;         // 중개사 소개 메시지
    experience?: string;
    special_service?: string;
  }) {
    // 경매 중인 매물인지 확인
    const { data: property } = await supabaseClient
      .from('properties')
      .select('id, status, auction_end_at')
      .eq('id', dto.property_id)
      .single();

    if (!property) throw new NotFoundException('매물을 찾을 수 없습니다.');
    if (property.status !== 'auction_open') throw new ForbiddenException('현재 입찰 가능한 매물이 아닙니다.');
    if (new Date(property.auction_end_at) < new Date()) throw new ForbiddenException('경매가 종료된 매물입니다.');

    // 중복 입찰 방지
    const { data: existing } = await supabaseClient
      .from('bids')
      .select('id')
      .eq('property_id', dto.property_id)
      .eq('agent_id', agentId)
      .single();

    if (existing) throw new ConflictException('이미 입찰한 매물입니다.');

    // 최저 요율 가드레일 (0.3% 미만 입찰 불가)
    if (dto.commission_rate < 0.3) throw new ForbiddenException('최저 수수료율은 0.3%입니다.');

    const { data, error } = await supabaseClient
      .from('bids')
      .insert({
        agent_id: agentId,
        ...dto,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ── 내 입찰 목록 (중개사) ──────────────────────
  async findMyBids(agentId: string) {
    const { data } = await supabaseClient
      .from('bids')
      .select(`
        *,
        property:properties!property_id(
          id, apartment_name, address, area, asking_price,
          status, auction_end_at
        )
      `)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    return data;
  }

  // ── 입찰 수정 (경매 중에만 가능) ─────────────
  async update(bidId: string, agentId: string, dto: {
    commission_rate?: number;
    message?: string;
    special_service?: string;
  }) {
    const { data: bid } = await supabaseClient
      .from('bids')
      .select('agent_id, status, property:properties!property_id(status)')
      .eq('id', bidId)
      .single();

    if (!bid) throw new NotFoundException();
    if (bid.agent_id !== agentId) throw new ForbiddenException();
    if (bid.status !== 'pending') throw new ForbiddenException('이미 처리된 입찰은 수정할 수 없습니다.');

    const { data } = await supabaseClient
      .from('bids')
      .update(dto)
      .eq('id', bidId)
      .select()
      .single();

    return data;
  }

  // ── 입찰 취소 ─────────────────────────────────
  async cancel(bidId: string, agentId: string) {
    const { data: bid } = await supabaseClient
      .from('bids')
      .select('agent_id, status')
      .eq('id', bidId)
      .single();

    if (!bid) throw new NotFoundException();
    if (bid.agent_id !== agentId) throw new ForbiddenException();
    if (bid.status !== 'pending') throw new ForbiddenException('처리된 입찰은 취소할 수 없습니다.');

    await supabaseClient.from('bids').update({ status: 'cancelled' }).eq('id', bidId);
    return { message: '입찰이 취소되었습니다.' };
  }
}
