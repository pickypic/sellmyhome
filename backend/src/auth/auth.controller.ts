import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  register(@Body() dto: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'seller' | 'agent';
  }) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto);
  }

  @Post('kakao')
  @ApiOperation({ summary: '카카오 소셜 로그인' })
  kakaoLogin(@Body() dto: { access_token: string }) {
    return this.authService.kakaoLogin(dto.access_token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: '비밀번호 재설정 요청' })
  forgotPassword(@Body() dto: { email: string }) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  getMe(@Request() req: any) {
    return req.user;
  }
}
