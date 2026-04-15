import { Controller, Get, Patch, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('어드민')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── 통계 ─────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: '플랫폼 통계 대시보드' })
  getStats(@Request() req: any) {
    return this.adminService.getStats(req.user.role);
  }

  // ── 회원 관리 ─────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: '전체 회원 목록 (검색/필터/페이지네이션)' })
  getUsers(@Request() req: any, @Query() query: any) {
    return this.adminService.getUsers(req.user.role, query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: '회원 상세 정보' })
  getUser(@Request() req: any, @Param('id') id: string) {
    return this.adminService.getUser(req.user.role, id);
  }

  @Patch('users/:id/block')
  @ApiOperation({ summary: '회원 차단' })
  blockUser(@Request() req: any, @Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.blockUser(req.user.role, req.user.id, id, dto.reason);
  }

  @Patch('users/:id/unblock')
  @ApiOperation({ summary: '회원 차단 해제' })
  unblockUser(@Request() req: any, @Param('id') id: string) {
    return this.adminService.unblockUser(req.user.role, req.user.id, id);
  }

  @Post('users/:id/points')
  @ApiOperation({ summary: '포인트 지급 / 차감 (음수면 차감)' })
  adjustPoints(@Request() req: any, @Param('id') id: string, @Body() dto: { amount: number; reason: string }) {
    return this.adminService.adjustPoints(req.user.role, req.user.id, id, dto);
  }

  @Post('users/:id/sanction')
  @ApiOperation({ summary: '사용자 제재 (warning/suspend/ban/restore)' })
  sanction(@Request() req: any, @Param('id') id: string, @Body() dto: { action_type: 'warning' | 'suspend' | 'ban' | 'restore'; reason: string; expires_at?: string }) {
    return this.adminService.sanctionUser(id, req.user.id, req.user.role, dto);
  }

  // ── 매물 관리 ─────────────────────────────────────────────
  @Get('properties')
  @ApiOperation({ summary: '전체 매물 목록' })
  getProperties(@Request() req: any, @Query() query: any) {
    return this.adminService.getProperties(req.user.role, query);
  }

  // ── 거래 관리 ─────────────────────────────────────────────
  @Get('transactions')
  @ApiOperation({ summary: '전체 거래 목록' })
  getTransactions(@Request() req: any, @Query() query: any) {
    return this.adminService.getTransactions(req.user.role, query);
  }

  // ── 입찰 관리 ─────────────────────────────────────────────
  @Get('bids')
  @ApiOperation({ summary: '전체 입찰 목록' })
  getBids(@Request() req: any, @Query() query: any) {
    return this.adminService.getBids(req.user.role, query);
  }

  // ── 포인트/결제 내역 ──────────────────────────────────────
  @Get('point-transactions')
  @ApiOperation({ summary: '전체 포인트/결제 내역' })
  getPointTransactions(@Request() req: any, @Query() query: any) {
    return this.adminService.getPointTransactions(req.user.role, query);
  }

  // ── 리뷰 관리 ─────────────────────────────────────────────
  @Get('reviews')
  @ApiOperation({ summary: '전체 리뷰 목록' })
  getReviews(@Request() req: any, @Query() query: any) {
    return this.adminService.getReviews(req.user.role, query);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: '리뷰 삭제' })
  deleteReview(@Request() req: any, @Param('id') id: string) {
    return this.adminService.deleteReview(req.user.role, id);
  }

  // ── 인증 심사 ─────────────────────────────────────────────
  @Get('verifications')
  @ApiOperation({ summary: '인증 심사 대기 목록' })
  getPendingVerifications(@Request() req: any) {
    return this.adminService.getPendingVerifications(req.user.role);
  }

  @Patch('verifications/property/:id/approve')
  approveProperty(@Request() req: any, @Param('id') id: string) {
    return this.adminService.approvePropertyVerification(id, req.user.id, req.user.role);
  }

  @Patch('verifications/property/:id/reject')
  rejectProperty(@Request() req: any, @Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.rejectPropertyVerification(id, req.user.id, req.user.role, dto);
  }

  @Patch('verifications/agent/:id/approve')
  approveAgent(@Request() req: any, @Param('id') id: string) {
    return this.adminService.approveAgentVerification(id, req.user.id, req.user.role);
  }

  @Patch('verifications/agent/:id/reject')
  rejectAgent(@Request() req: any, @Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.rejectAgentVerification(id, req.user.id, req.user.role, dto);
  }
}
