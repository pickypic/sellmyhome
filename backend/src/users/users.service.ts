import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class UsersService {
  // ── 내 프로필 수정 ─────────────────────────────
  async updateProfile(userId: string, dto: {
    name?: string;
    phone?: string;
    profile_image?: string;
    fcm_token?: string;
  }) {
    const { data, error } = await supabaseClient
      .from('users')
      .update(dto)
      .eq('id', userId)
      .select('id, email, name, phone, role, profile_image, is_verified')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ── 프로필 이미지 업로드 (Supabase Storage signed URL 발급) ─
  async getProfileImageUploadUrl(userId: string, fileName: string) {
    const path = `avatars/${userId}/${Date.now()}_${fileName}`;
    const { data, error } = await supabaseClient
      .storage
      .from('property-images') // public 버킷 재사용 (프로필용)
      .createSignedUploadUrl(path);

    if (error) throw new Error(error.message);
    return { upload_url: data.signedUrl, path };
  }

  // ── 중개사 공개 프로필 조회 ────────────────────
  async getAgentPublicProfile(agentId: string) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('id, name, profile_image, role, is_verified')
      .eq('id', agentId)
      .eq('role', 'agent')
      .single();

    if (!user) throw new NotFoundException('중개사를 찾을 수 없습니다.');

    const { data: profile } = await supabaseClient
      .from('agent_profiles')
      .select(`
        license_number, office_name, office_address,
        region, career_years, specialties,
        avg_rating, review_count, is_license_verified
      `)
      .eq('user_id', agentId)
      .single();

    const { data: reviews } = await supabaseClient
      .from('reviews')
      .select('overall_rating, content, created_at, reviewer:users!reviewer_id(name)')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(5);

    return { ...user, profile, recent_reviews: reviews };
  }

  // ── 중개사 자격 인증 서류 제출 ────────────────
  async submitAgentVerification(agentId: string, dto: {
    license_number: string;
    office_name: string;
    office_address: string;
    region: string;
    career_years: number;
    specialties?: string[];
    doc_urls: string[]; // Supabase Storage 경로 목록
  }) {
    // agent_profiles upsert
    const { data, error } = await supabaseClient
      .from('agent_profiles')
      .upsert({
        user_id: agentId,
        license_number: dto.license_number,
        office_name: dto.office_name,
        office_address: dto.office_address,
        region: dto.region,
        career_years: dto.career_years,
        specialties: dto.specialties || [],
        is_license_verified: false, // 어드민 심사 대기
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 인증 서류 URL을 users 테이블의 verification_docs에 저장
    await supabaseClient
      .from('users')
      .update({ is_verified: false }) // 재심사 필요 시 false로 초기화
      .eq('id', agentId);

    return { message: '인증 서류가 제출되었습니다. 영업일 기준 1~3일 내 심사됩니다.', profile: data };
  }

  // ── 인증 서류 업로드 URL 발급 (verification-docs 버킷) ─
  async getVerificationDocUploadUrl(agentId: string, fileName: string) {
    const path = `${agentId}/${Date.now()}_${fileName}`;
    const { data, error } = await supabaseClient
      .storage
      .from('verification-docs')
      .createSignedUploadUrl(path);

    if (error) throw new Error(error.message);
    return { upload_url: data.signedUrl, path };
  }
}
