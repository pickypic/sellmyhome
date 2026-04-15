import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('알림')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // GET /notifications — 알림 목록
  @Get()
  @ApiOperation({ summary: '알림 목록 조회 (최근 50개 + 미읽음 수)' })
  findAll(@Request() req: any) {
    return this.notificationsService.findAll(req.user.id);
  }

  // PATCH /notifications/read-all — 전체 읽음 (특정 id 보다 먼저 등록)
  @Patch('read-all')
  @ApiOperation({ summary: '전체 알림 읽음 처리' })
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  // PATCH /notifications/:id/read — 단일 읽음
  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리' })
  markRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markRead(id, req.user.id);
  }
}
