import { Controller, Get, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardMetrics(@Headers('x-tenant-id') tenantId: string) {
    return this.analyticsService.getDashboardMetrics(tenantId);
  }
}
