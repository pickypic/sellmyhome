import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, Request, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('매물')
@Controller('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: '매물 등록' })
  create(@Request() req: any, @Body() dto: any) {
    return this.propertiesService.create(req.user.id, dto);
  }

  @Get('my/seller')
  @ApiOperation({ summary: '내 매물 목록 (매도자)' })
  findMySeller(@Request() req: any) {
    return this.propertiesService.findMySeller(req.user.id);
  }

  @Get('auctions/open')
  @ApiOperation({ summary: '역경매 오픈 매물 (중개사)' })
  findOpenAuctions(@Request() req: any) {
    return this.propertiesService.findOpenAuctions(req.user.id);
  }

  // ⚠️ ':id' 앞에 위치해야 함 — NestJS 라우트 우선순위
  @Get('search/apartment')
  @ApiOperation({ summary: '아파트 단지명 검색 (Kakao Local API 프록시)' })
  searchApartment(@Query('query') query: string) {
    return this.propertiesService.searchApartment(query ?? '');
  }

  @Get(':id')
  @ApiOperation({ summary: '매물 상세 조회' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/start-auction')
  @ApiOperation({ summary: '역경매 시작 (매도자)' })
  startAuction(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.startAuction(id, req.user.id);
  }

  @Post(':id/select-agent')
  @ApiOperation({ summary: '중개사 선택 (매도자)' })
  selectAgent(
    @Param('id') propertyId: string,
    @Body() dto: { bid_id: string },
    @Request() req: any,
  ) {
    return this.propertiesService.selectAgent(propertyId, dto.bid_id, req.user.id);
  }

  @Post(':id/upload-doc')
  @ApiOperation({ summary: '소유 인증 서류 업로드 (매도자)' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadDoc(
    @Param('id') id: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertiesService.uploadVerificationDoc(id, req.user.id, file);
  }

  @Post(':id/submit-verification')
  @ApiOperation({ summary: '소유 인증 신청 제출 (매도자)' })
  submitVerification(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: { owner_name: string; owner_phone: string; doc_paths?: string[] },
  ) {
    return this.propertiesService.submitVerification(id, req.user.id, dto);
  }
}
