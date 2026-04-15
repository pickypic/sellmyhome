import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ReviewsService {
  // ── 리뷰 작성 (거래 완료 후 매도자만 가능) ──────
  async create(reviewerId: string, dto: {
    transaction_id: string;
    overall_rating: number;      // 1~5
    manner_rating?: number;
    expertise_rating?: number;
    communication_rating?: number;
    result_rating?: number;
    content: string;
  }) {
    // 거래 존재 확인 및 완료 상태 검증
    const { data: tx } = await supabaseClient
      .from('transactions')
      .select('seller_id, agent_id, status')
      .eq('id', dto.transaction_id)
      .single();

    if (!tx) throw new NotFoundException('거래를 찾을 수 없습니다.');
    if (tx.seller_id !== reviewerId) throw new ForbiddenException('매도자만 리뷰를 작성할 수 있습니다.');
    if (tx.status !== 'completed') throw new ForbiddenException('거래 완료 후 리뷰를 작성할 수 있습니다.');

    // 중복 리뷰 방지
    const { data: existing } = await supabaseClient
      .from('reviews')
      .select('id')
      .eq('transaction_id', dto.transaction_id)
      .eq('reviewer_id', reviewerId)
      .single();

    if (existing) throw new ConflictException('이미 리뷰를 작성했습니다.');

    // 평점 범위 검증
    if (dto.overall_rating < 1 || dto.overall_rating > 5) {
      throw new ForbiddenException('평점은 1~5 사이여야 합니다.');
    }

    const { data, error } = await supabaseClient
      .from('reviews')
      .insert({
        transaction_id: dto.transaction_id,
        reviewer_id: reviewerId,
        agent_id: tx.agent_id,
        overall_rating: dto.overall_rating,
        manner_rating: dto.manner_rating,
        expertise_rating: dto.expertise_rating,
        communication_rating: dto.communication_rating,
        result_rating: dto.result_rating,
        content: dto.content,
        is_verified: true, // 거래 완료 인증 리뷰
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // agent_profiles avg_rating 갱신 (DB 트리거가 없을 경우 수동 업데이트)
    await this.recalcAgentRating(tx.agent_id);

    return data;
  }

  // ── 중개사 리뷰 목록 조회 ──────────────────────
  async getAgentReviews(agentId: string) {
    const { data } = await supabaseClient
      .from('reviews')
      .select(`
        id, overall_rating, manner_rating, expertise_rating,
        communication_rating, result_rating, content,
        is_verified, created_at,
        reviewer:users!reviewer_id(name)
      `)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    // 중개사 평균 평점 요약
    const { data: profile } = await supabaseClient
      .from('agent_profiles')
      .select('avg_rating, review_count')
      .eq('user_id', agentId)
      .single();

    return {
      reviews: data,
      summary: profile || { avg_rating: 0, review_count: 0 },
    };
  }

  // ── 평균 평점 재계산 (내부용) ──────────────────
  private async recalcAgentRating(agentId: string) {
    const { data } = await supabaseClient
      .from('reviews')
      .select('overall_rating')
      .eq('agent_id', agentId);

    if (!data || data.length === 0) return;

    const avg = data.reduce((sum, r) => sum + r.overall_rating, 0) / data.length;
    const rounded = Math.round(avg * 10) / 10;

    await supabaseClient
      .from('agent_profiles')
      .update({ avg_rating: rounded, review_count: data.length })
      .eq('user_id', agentId);
  }
}
