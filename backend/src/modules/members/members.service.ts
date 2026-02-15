import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto, BulkUploadMembersDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async create(tenantId: string, dto: CreateMemberDto): Promise<Member> {
    const member = this.memberRepo.create({ ...dto, tenantId });
    return this.memberRepo.save(member);
  }

  async bulkUpload(tenantId: string, dto: BulkUploadMembersDto): Promise<{ created: number }> {
    const members = dto.members.map((m) =>
      this.memberRepo.create({ ...m, groupId: dto.groupId, tenantId }),
    );
    await this.memberRepo.save(members, { chunk: 500 });
    return { created: members.length };
  }

  async findByGroup(tenantId: string, groupId: string): Promise<Member[]> {
    return this.memberRepo.find({
      where: { groupId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Member> {
    const member = await this.memberRepo.findOne({
      where: { id, tenantId },
      relations: ['group'],
    });
    if (!member) throw new NotFoundException(`Member ${id} not found`);
    return member;
  }

  async update(tenantId: string, id: string, dto: Partial<CreateMemberDto>): Promise<Member> {
    const member = await this.findOne(tenantId, id);
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }
}
