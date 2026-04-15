import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

// 거래 상태 머신: contract_pending → contract_signed → balance_pending
//               → registration_pending → completed
//               (언제든 cancelled 가능)
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  contract_pending: ['contract_signed', 'cancelled'],
  contract_signed: ['balance_pending', 'cancelled'],
  balance_pending: ['registration_pending', 'cancelled'],
  registration_pending: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

@Injectable()
export class TransactionsService {
  // ── 내 거래 목록 (매도자) ─────────────────────
  async findMySeller(sellerId: string) {
    const { data } = await supabaseClient
      .from('transactions')
      .select(`
        *,
        property:properties!property_id(id, apartment_name, address, asking_price),
        agent:users!agent_id(id, name, profile_image, phone)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    return data;
  }

  // ── 내 거래 목록 (중개사) ─────────────────────
  async findMyAgent(agentId: string) {
    const { data } = await supabaseClient
      .from('transactions')
      .select(`
        *,
        property:properties!property_id(id, apartment_name, address, asking_price),
        seller:users!seller_id(id, name, phone)
      `)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    return data;
  }

  // ── 거래 상세 조회 ─────────────────────────────
  async findOne(transactionId: string, userId: string) {
    const { data: tx } = await supabaseClient
      .from('transactions')
      .select(`
        *,
        property:properties!property_id(
          id, apartment_name, address, area, floor, asking_price, images
        ),
        seller:users!seller_id(id, name, phone),
        agent:users!agent_id(id, name, phone, profile_image)
      `)
      .eq('id', transactionId)
      .single();

    if (!tx) throw new NotFoundException('거래를 찾을 수 없습니다.');

    // 당사자만 열람 가능
    if (tx.seller_id !== userId && tx.agent_id !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return tx;
  }

  // ── 거래 상태 변경 ─────────────────────────────
  async updateStatus(
    transactionId: string,
    userId: string,
    dto: {
      status: string;
      memo?: string;
      agreed_price?: number;
      contract_date?: string;
      balance_date?: string;
      completion_date?: string;
    },
  ) {
    const { data: tx } = await supabaseClient
      .from('transactions')
      .select('seller_id, agent_id, status')
      .eq('id', transactionId)
      .single();

    if (!tx) throw new NotFoundException('거래를 찾을 수 없습니다.');

    // 당사자만 상태 변경 가능
    if (tx.seller_id !== userId && tx.agent_id !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    // 상태 전이 유효성 검사
    const allowed = VALID_STATUS_TRANSITIONS[tx.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new ForbiddenException(
        `'${tx.status}' 상태에서 '${dto.status}'로 변경할 수 없습니다.`,
      );
    }

    const updatePayload: Record<string, any> = { status: dto.status };
    if (dto.memo !== undefined) updatePayload.memo = dto.memo;
    if (dto.agreed_price !== undefined) updatePayload.agreed_price = dto.agreed_price;
    if (dto.contract_date !== undefined) updatePayload.contract_date = dto.contract_date;
    if (dto.balance_date !== undefined) updatePayload.balance_date = dto.balance_date;
    if (dto.completion_date !== undefined) updatePayload.completion_date = dto.completion_date;

    const { data, error } = await supabaseClient
      .from('transactions')
      .update(updatePayload)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
