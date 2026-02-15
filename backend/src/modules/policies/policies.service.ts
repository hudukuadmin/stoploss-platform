import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { BindPolicyDto } from './dto/bind-policy.dto';
import { QuotesService } from '../quotes/quotes.service';
import { QuoteStatus, PolicyStatus } from '../../common/enums';
import { randomUUID } from 'crypto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepo: Repository<Policy>,
    private readonly quotesService: QuotesService,
  ) {}

  async bindQuote(tenantId: string, dto: BindPolicyDto): Promise<Policy> {
    const quote = await this.quotesService.findOne(tenantId, dto.quoteId);

    if (quote.status !== QuoteStatus.APPROVED) {
      throw new BadRequestException('Only approved quotes can be bound into policies');
    }

    if (quote.quoteValidUntil && new Date(quote.quoteValidUntil) < new Date()) {
      throw new BadRequestException('Quote has expired');
    }

    const existingPolicy = await this.policyRepo.findOne({
      where: { quoteId: dto.quoteId, tenantId },
    });
    if (existingPolicy) {
      throw new BadRequestException('A policy already exists for this quote');
    }

    const policy = this.policyRepo.create({
      tenantId,
      policyNumber: this.generatePolicyNumber(),
      groupId: quote.groupId,
      quoteId: quote.id,
      coverageType: quote.coverageType,
      status: PolicyStatus.ACTIVE,
      effectiveDate: quote.effectiveDate,
      terminationDate: quote.expirationDate,
      specificAttachmentPoint: quote.specificAttachmentPoint,
      specificMaxLiability: quote.specificMaxLiability,
      aggregateAttachmentPoint: quote.aggregateAttachmentPoint,
      aggregateAttachmentFactor: quote.aggregateAttachmentFactor,
      aggregateMaxLiability: quote.aggregateMaxLiability,
      totalAnnualPremium: quote.totalAnnualPremium,
      pepmRate: quote.pepmRate,
      terms: dto.terms || {},
      boundBy: dto.boundBy,
      boundAt: new Date(),
    });

    const savedPolicy = await this.policyRepo.save(policy);

    await this.quotesService.updateStatus(tenantId, quote.id, QuoteStatus.BOUND);

    return savedPolicy;
  }

  async findAll(tenantId: string): Promise<Policy[]> {
    return this.policyRepo.find({
      where: { tenantId },
      relations: ['group', 'quote'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Policy> {
    const policy = await this.policyRepo.findOne({
      where: { id, tenantId },
      relations: ['group', 'quote'],
    });
    if (!policy) throw new NotFoundException(`Policy ${id} not found`);
    return policy;
  }

  async updateStatus(tenantId: string, id: string, status: PolicyStatus): Promise<Policy> {
    const policy = await this.findOne(tenantId, id);
    policy.status = status;
    return this.policyRepo.save(policy);
  }

  private generatePolicyNumber(): string {
    const prefix = 'SLP';
    const year = new Date().getFullYear();
    const random = randomUUID().substring(0, 6).toUpperCase();
    return `${prefix}-${year}-${random}`;
  }
}
