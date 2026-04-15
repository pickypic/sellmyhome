import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class PointsService {
  // ── 포인트 잔액 조회 ──────────────────────────
  async getBalance(userId: string) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('point_balance')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return { balance: user.point_balance ?? 0 };
  }

  // ── 포인트 내역 조회 ──────────────────────────
  async getHistory(userId: string) {
    const { data } = await supabaseClient
      .from('point_transactions')
      .select('id, amount, type, description, balance, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data;
  }

  // ── 포인트 충전 (토스페이먼츠 결제창 준비) ────
  async initiatePurchase(userId: string, dto: { amount: number }) {
    if (dto.amount < 1000) {
      throw new ForbiddenException('최소 충전 금액은 1,000원입니다.');
    }

    // 토스페이먼츠 결제창을 열기 위한 orderId 생성
    // 실제 결제는 프론트에서 토스페이먼츠 SDK로 처리하고, 결과는 웹훅으로 수신
    const orderId = `SMH-${userId.slice(0, 8)}-${Date.now()}`;

    return {
      order_id: orderId,
      amount: dto.amount,
      order_name: `셀마이홈 포인트 ${dto.amount.toLocaleString()}원 충전`,
      customer_key: userId,
      success_url: `${process.env.FRONTEND_URL}/points/success`,
      fail_url: `${process.env.FRONTEND_URL}/points/fail`,
    };
  }

  // ── 토스페이먼츠 결제 완료 웹훅 처리 ─────────
  async handleTossWebhook(payload: {
    eventType: string;
    data: {
      paymentKey: string;
      orderId: string;
      status: string;
      totalAmount: number;
      metadata?: { userId?: string };
    };
  }) {
    if (payload.eventType !== 'PAYMENT_STATUS_CHANGED') return { ok: true };
    if (payload.data.status !== 'DONE') return { ok: true };

    // orderId에서 userId 추출: SMH-{userId8chars}-{timestamp}
    const parts = payload.data.orderId.split('-');
    if (parts.length < 3 || parts[0] !== 'SMH') {
      return { ok: false, reason: 'invalid orderId format' };
    }

    // 토스 API로 결제 검증
    const verified = await this.verifyTossPayment(
      payload.data.paymentKey,
      payload.data.orderId,
      payload.data.totalAmount,
    );
    if (!verified) return { ok: false, reason: 'payment verification failed' };

    // 중복 처리 방지: paymentKey로 기존 내역 확인
    const { data: existing } = await supabaseClient
      .from('point_transactions')
      .select('id')
      .eq('ref_id', payload.data.paymentKey)
      .single();

    if (existing) return { ok: true, duplicate: true };

    // 포인트 잔액 조회
    const { data: user } = await supabaseClient
      .from('users')
      .select('point_balance, id')
      .eq('id', payload.data.metadata?.userId ?? '')
      .single();

    if (!user) return { ok: false, reason: 'user not found' };

    const newBalance = (user.point_balance ?? 0) + payload.data.totalAmount;

    // 트랜잭션: 잔액 업데이트 + 내역 기록
    await supabaseClient
      .from('users')
      .update({ point_balance: newBalance })
      .eq('id', user.id);

    await supabaseClient.from('point_transactions').insert({
      user_id: user.id,
      amount: payload.data.totalAmount,
      type: 'purchase',
      description: `포인트 충전 (토스페이먼츠)`,
      ref_id: payload.data.paymentKey,
      balance: newBalance,
    });

    return { ok: true };
  }

  // ── 포인트 차감 (내부용: 입찰/경매 수수료) ───
  async deductPoints(userId: string, amount: number, type: 'auction_fee' | 'bid_fee', description: string) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('point_balance')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if ((user.point_balance ?? 0) < amount) {
      throw new ForbiddenException('포인트 잔액이 부족합니다.');
    }

    const newBalance = user.point_balance - amount;

    await supabaseClient
      .from('users')
      .update({ point_balance: newBalance })
      .eq('id', userId);

    await supabaseClient.from('point_transactions').insert({
      user_id: userId,
      amount: -amount,
      type,
      description,
      balance: newBalance,
    });

    return { balance: newBalance };
  }

  // ── 토스페이먼츠 결제 서버 검증 (내부) ───────
  private async verifyTossPayment(paymentKey: string, orderId: string, amount: number): Promise<boolean> {
    try {
      const credentials = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64');
      const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
