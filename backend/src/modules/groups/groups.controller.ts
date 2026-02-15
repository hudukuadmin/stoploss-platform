import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.groupsService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.groupsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.groupsService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateGroupDto>,
  ) {
    return this.groupsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.groupsService.remove(tenantId, id);
  }
}
