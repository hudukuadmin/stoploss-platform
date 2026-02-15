import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { BindPolicyDto } from './dto/bind-policy.dto';
import { PolicyStatus } from '../../common/enums';

@Controller('api/policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post('bind')
  bindQuote(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: BindPolicyDto,
  ) {
    return this.policiesService.bindQuote(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.policiesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.policiesService.findOne(tenantId, id);
  }

  @Put(':id/status')
  updateStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { status: PolicyStatus },
  ) {
    return this.policiesService.updateStatus(tenantId, id, body.status);
  }
}
