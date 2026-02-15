import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteStatus } from '../../common/enums';

@Controller('api/quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  generateQuote(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateQuoteDto,
  ) {
    return this.quotesService.generateQuote(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.quotesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.quotesService.findOne(tenantId, id);
  }

  @Put(':id/status')
  updateStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { status: QuoteStatus; notes?: string },
  ) {
    return this.quotesService.updateStatus(tenantId, id, body.status, body.notes);
  }
}
