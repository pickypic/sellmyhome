import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('id, email, name, role, is_verified, is_active')
      .eq('id', payload.sub)
      .single();

    if (!user || !user.is_active) throw new UnauthorizedException();
    return user;
  }
}
