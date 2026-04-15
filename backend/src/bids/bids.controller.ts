import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('입찰(역경매)')
@Controller('bids')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @ApiOperation({ summary: '입찰 제출 (중개사)' })
  create(@Request() req: any, @Body() dto: any) {
    return this.bidsService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: '내 입찰 목록 (중개사)' })
  findMyBids(@Request() req: any) {
    return this.bidsService.findMyBids(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '입찰 수정' })
  update(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.bidsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '입찰 취소' })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bidsService.cancel(id, req.user.id);
  }
}
