import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { GroupsService } from '../groups/groups.service';
import { MembersService } from '../members/members.service';
import { RiskScoringService } from '../risk-scoring/risk-scoring.service';
import { QuoteStatus, CoverageType } from '../../common/enums';
import { randomUUID } from 'crypto';

@Injectable()
export class QuotesService {
  private readonly SPECIFIC_BASE_RATE = 0.035;
  private readonly AGGREGATE_BASE_RATE = 0.012;

  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    private readonly groupsService: GroupsService,
    private readonly membersService: MembersService,
    private readonly riskScoringService: RiskScoringService,
  ) {}

  async generateQuote(tenantId: string, dto: CreateQuoteDto): Promise<Quote> {
    const group = await this.groupsService.findOne(tenantId, dto.groupId);
    const members = await this.membersService.findByGroup(tenantId, dto.groupId);

    if (!members.length && !group.memberCount) {
      throw new BadRequestException('Group must have members or a member count to generate a quote');
    }

    const riskAssessment = this.riskScoringService.assessGroupRisk(group, members);
    const memberCount = members.length || group.memberCount;

    const specificAttachmentPoint = dto.specificAttachmentPoint
      ?? riskAssessment.recommendedSpecificAttachment;
    const aggregateAttachmentFactor = dto.aggregateAttachmentFactor
      ?? riskAssessment.recommendedAggregateAttachmentFactor;

    let specificPremiumRate = 0;
    let specificAnnualPremium = 0;
    let specificMaxLiability = dto.specificMaxLiability ?? null;
    let aggregateAttachmentPoint = 0;
    let aggregatePremiumRate = 0;
    let aggregateAnnualPremium = 0;
    let aggregateMaxLiability = dto.aggregateMaxLiability ?? null;

    if (dto.coverageType === CoverageType.SPECIFIC || dto.coverageType === CoverageType.BOTH) {
      specificPremiumRate = this.calculateSpecificRate(
        riskAssessment.overallRiskScore,
        specificAttachmentPoint,
        memberCount,
      );
      specificAnnualPremium = specificPremiumRate * memberCount * 12;
      if (!specificMaxLiability) {
        specificMaxLiability = specificAttachmentPoint * memberCount * 0.1;
      }
    }

    if (dto.coverageType === CoverageType.AGGREGATE || dto.coverageType === CoverageType.BOTH) {
      aggregateAttachmentPoint = riskAssessment.expectedClaimsCost * aggregateAttachmentFactor;
      aggregatePremiumRate = this.calculateAggregateRate(
        riskAssessment.overallRiskScore,
        aggregateAttachmentFactor,
        memberCount,
      );
      aggregateAnnualPremium = aggregatePremiumRate * memberCount * 12;
      if (!aggregateMaxLiability) {
        aggregateMaxLiability = aggregateAttachmentPoint * 0.5;
      }
    }

    const totalAnnualPremium = specificAnnualPremium + aggregateAnnualPremium;
    const pepmRate = memberCount > 0 ? totalAnnualPremium / (memberCount * 12) : 0;

    const effectiveDate = new Date(dto.effectiveDate);
    const contractMonths = dto.contractPeriodMonths || 12;
    const expirationDate = dto.expirationDate
      ? new Date(dto.expirationDate)
      : new Date(effectiveDate.getTime() + contractMonths * 30 * 24 * 60 * 60 * 1000);

    const quoteValidUntil = new Date();
    quoteValidUntil.setDate(quoteValidUntil.getDate() + 30);

    const quote = this.quoteRepo.create({
      tenantId,
      quoteNumber: this.generateQuoteNumber(),
      groupId: dto.groupId,
      coverageType: dto.coverageType,
      status: QuoteStatus.DRAFT,
      specificAttachmentPoint: specificAttachmentPoint ?? undefined,
      specificMaxLiability: specificMaxLiability ?? undefined,
      specificPremiumRate: Math.round(specificPremiumRate * 1000000) / 1000000,
      specificAnnualPremium: Math.round(specificAnnualPremium * 100) / 100,
      aggregateAttachmentPoint: Math.round(aggregateAttachmentPoint * 100) / 100,
      aggregateAttachmentFactor: aggregateAttachmentFactor ?? undefined,
      aggregateMaxLiability: aggregateMaxLiability ?? undefined,
      aggregatePremiumRate: Math.round(aggregatePremiumRate * 1000000) / 1000000,
      aggregateAnnualPremium: Math.round(aggregateAnnualPremium * 100) / 100,
      totalAnnualPremium: Math.round(totalAnnualPremium * 100) / 100,
      pepmRate: Math.round(pepmRate * 100) / 100,
      riskScore: riskAssessment.overallRiskScore,
      riskFactors: riskAssessment.specificFactors as Record<string, any>,
      expectedClaims: riskAssessment.expectedClaimsCost,
      effectiveDate,
      expirationDate,
      contractPeriodMonths: contractMonths,
      quoteValidUntil,
    } as Partial<Quote>);

    return this.quoteRepo.save(quote);
  }

  async findAll(tenantId: string): Promise<Quote[]> {
    return this.quoteRepo.find({
      where: { tenantId },
      relations: ['group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Quote> {
    const quote = await this.quoteRepo.findOne({
      where: { id, tenantId },
      relations: ['group'],
    });
    if (!quote) throw new NotFoundException(`Quote ${id} not found`);
    return quote;
  }

  async updateStatus(tenantId: string, id: string, status: QuoteStatus, notes?: string): Promise<Quote> {
    const quote = await this.findOne(tenantId, id);
    quote.status = status;
    if (notes) quote.underwriterNotes = notes;
    return this.quoteRepo.save(quote);
  }

  private calculateSpecificRate(riskScore: number, attachmentPoint: number, memberCount: number): number {
    const baseRate = this.SPECIFIC_BASE_RATE;
    const riskMultiplier = 0.5 + riskScore * 1.5;
    const attachmentFactor = 250000 / attachmentPoint;
    const credibilityFactor = Math.min(memberCount / 500, 1.0) * 0.3 + 0.7;
    return baseRate * riskMultiplier * attachmentFactor * credibilityFactor;
  }

  private calculateAggregateRate(riskScore: number, aggregateFactor: number, memberCount: number): number {
    const baseRate = this.AGGREGATE_BASE_RATE;
    const riskMultiplier = 0.5 + riskScore * 1.5;
    const corridorFactor = 1.25 / aggregateFactor;
    const sizeFactor = memberCount < 200 ? 1.3 : memberCount > 1000 ? 0.85 : 1.0;
    return baseRate * riskMultiplier * corridorFactor * sizeFactor;
  }

  private generateQuoteNumber(): string {
    const prefix = 'SLQ';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomUUID().substring(0, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
