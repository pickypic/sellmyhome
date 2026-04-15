import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('포인트')
@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  // GET /points/balance — 잔액 조회
  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '포인트 잔액 조회' })
  getBalance(@Request() req: any) {
    return this.pointsService.getBalance(req.user.id);
  }

  // GET /points/history — 포인트 내역
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '포인트 충전/사용 내역' })
  getHistory(@Request() req: any) {
    return this.pointsService.getHistory(req.user.id);
  }

  // POST /points/purchase — 토스페이먼츠 결제창 준비
  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '포인트 충전 (토스페이먼츠 결제창 파라미터 반환)' })
  purchase(@Request() req: any, @Body() dto: { amount: number }) {
    return this.pointsService.initiatePurchase(req.user.id, dto);
  }

  // POST /points/webhook/toss — 토스 결제 완료 웹훅 (인증 없음)
  @Post('webhook/toss')
  @ApiOperation({ summary: '토스페이먼츠 결제 완료 웹훅' })
  tossWebhook(@Body() payload: any) {
    return this.pointsService.handleTossWebhook(payload);
  }
}
