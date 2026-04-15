import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // ── 회원가입 ──────────────────────────────────
  async register(dto: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'seller' | 'agent';
  }) {
    const { data: existing } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const { data: user, error } = await supabaseClient
      .from('users')
      .insert({
        email: dto.email,
        password_hash: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        role: dto.role,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return this.generateToken(user);
  }

  // ── 로그인 ────────────────────────────────────
  async login(dto: { email: string; password: string }) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .single();

    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    return this.generateToken(user);
  }

  // ── 카카오 소셜 로그인 ────────────────────────
  async kakaoLogin(kakaoToken: string) {
    // 카카오 API로 사용자 정보 조회
    const res = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoToken}` },
    });
    const kakaoUser = await res.json();

    const email = kakaoUser.kakao_account?.email;
    if (!email) throw new UnauthorizedException('카카오 이메일 정보가 없습니다.');

    // 기존 사용자 조회 또는 신규 생성
    let { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      const { data: newUser } = await supabaseClient
        .from('users')
        .insert({
          email,
          name: kakaoUser.kakao_account?.profile?.nickname || '사용자',
          provider: 'kakao',
          provider_id: String(kakaoUser.id),
        })
        .select()
        .single();
      user = newUser;
    }

    return this.generateToken(user);
  }

  // ── 비밀번호 재설정 요청 ──────────────────────
  async requestPasswordReset(email: string) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) return { message: '이메일을 확인해주세요.' }; // 보안상 동일 메시지

    // TODO: 이메일 발송 (Supabase Auth 또는 SendGrid)
    return { message: '비밀번호 재설정 이메일을 발송했습니다.' };
  }

  // ── JWT 토큰 생성 ─────────────────────────────
  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    };
  }
}
