import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/agents/:id — 중개사 공개 프로필
  @Get('agents/:id')
  @ApiOperation({ summary: '중개사 공개 프로필 조회' })
  getAgentProfile(@Param('id') id: string) {
    return this.usersService.getAgentPublicProfile(id);
  }

  // PATCH /users/profile — 내 프로필 수정
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 수정' })
  updateProfile(
    @Request() req: any,
    @Body() dto: { name?: string; phone?: string; profile_image?: string; fcm_token?: string },
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  // POST /users/profile/image — 프로필 이미지 업로드 URL 발급
  @Post('profile/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 이미지 업로드 URL 발급' })
  getProfileImageUrl(
    @Request() req: any,
    @Body() dto: { file_name: string },
  ) {
    return this.usersService.getProfileImageUploadUrl(req.user.id, dto.file_name);
  }

  // POST /users/agent/verify — 중개사 자격 인증 서류 제출
  @Post('agent/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '중개사 자격 인증 서류 제출' })
  submitVerification(
    @Request() req: any,
    @Body() dto: {
      license_number: string;
      office_name: string;
      office_address: string;
      region: string;
      career_years: number;
      specialties?: string[];
      doc_urls: string[];
    },
  ) {
    return this.usersService.submitAgentVerification(req.user.id, dto);
  }

  // POST /users/agent/verify/upload-url — 인증 서류 업로드 URL 발급
  @Post('agent/verify/upload-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '인증 서류 업로드 URL 발급 (verification-docs 버킷)' })
  getVerificationDocUrl(
    @Request() req: any,
    @Body() dto: { file_name: string },
  ) {
    return this.usersService.getVerificationDocUploadUrl(req.user.id, dto.file_name);
  }
}
