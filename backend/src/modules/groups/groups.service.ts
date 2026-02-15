import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async create(tenantId: string, dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepo.create({ ...dto, tenantId });
    return this.groupRepo.save(group);
  }

  async findAll(tenantId: string): Promise<Group[]> {
    return this.groupRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Group> {
    const group = await this.groupRepo.findOne({
      where: { id, tenantId },
      relations: ['members', 'quotes', 'policies'],
    });
    if (!group) throw new NotFoundException(`Group ${id} not found`);
    return group;
  }

  async update(tenantId: string, id: string, dto: Partial<CreateGroupDto>): Promise<Group> {
    const group = await this.findOne(tenantId, id);
    Object.assign(group, dto);
    return this.groupRepo.save(group);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const group = await this.findOne(tenantId, id);
    await this.groupRepo.remove(group);
  }
}
