import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('거래')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // GET /transactions/my/seller
  @Get('my/seller')
  @ApiOperation({ summary: '내 거래 목록 (매도자)' })
  findMySeller(@Request() req: any) {
    return this.transactionsService.findMySeller(req.user.id);
  }

  // GET /transactions/my/agent
  @Get('my/agent')
  @ApiOperation({ summary: '내 거래 목록 (중개사)' })
  findMyAgent(@Request() req: any) {
    return this.transactionsService.findMyAgent(req.user.id);
  }

  // GET /transactions/:id
  @Get(':id')
  @ApiOperation({ summary: '거래 상세 조회' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  // PATCH /transactions/:id/status
  @Patch(':id/status')
  @ApiOperation({ summary: '거래 상태 변경 (계약/잔금/등기/완료)' })
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: {
      status: string;
      memo?: string;
      agreed_price?: number;
      contract_date?: string;
      balance_date?: string;
      completion_date?: string;
    },
  ) {
    return this.transactionsService.updateStatus(id, req.user.id, dto);
  }
}
