import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('리뷰')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // POST /reviews — 리뷰 작성
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 작성 (거래 완료 후 매도자만)' })
  create(
    @Request() req: any,
    @Body() dto: {
      transaction_id: string;
      overall_rating: number;
      manner_rating?: number;
      expertise_rating?: number;
      communication_rating?: number;
      result_rating?: number;
      content: string;
    },
  ) {
    return this.reviewsService.create(req.user.id, dto);
  }

  // GET /reviews/agent/:id — 중개사 리뷰 목록
  @Get('agent/:id')
  @ApiOperation({ summary: '중개사 리뷰 목록 조회' })
  getAgentReviews(@Param('id') id: string) {
    return this.reviewsService.getAgentReviews(id);
  }
}
