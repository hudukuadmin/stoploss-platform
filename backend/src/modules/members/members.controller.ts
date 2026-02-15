import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, BulkUploadMembersDto } from './dto/create-member.dto';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateMemberDto,
  ) {
    return this.membersService.create(tenantId, dto);
  }

  @Post('bulk')
  bulkUpload(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: BulkUploadMembersDto,
  ) {
    return this.membersService.bulkUpload(tenantId, dto);
  }

  @Get()
  findByGroup(
    @Headers('x-tenant-id') tenantId: string,
    @Query('groupId') groupId: string,
  ) {
    return this.membersService.findByGroup(tenantId, groupId);
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.membersService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateMemberDto>,
  ) {
    return this.membersService.update(tenantId, id, dto);
  }
}
