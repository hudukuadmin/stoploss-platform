import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { UnderwritingService } from './underwriting.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('api/underwriting')
export class UnderwritingController {
  constructor(private readonly underwritingService: UnderwritingService) {}

  @Post('submit/:quoteId')
  submitForReview(
    @Headers('x-tenant-id') tenantId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.underwritingService.submitForReview(tenantId, quoteId);
  }

  @Put('review')
  manualReview(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.underwritingService.manualReview(tenantId, dto);
  }

  @Get('quote/:quoteId')
  findByQuote(
    @Headers('x-tenant-id') tenantId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.underwritingService.findByQuote(tenantId, quoteId);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.underwritingService.findAll(tenantId);
  }
}
