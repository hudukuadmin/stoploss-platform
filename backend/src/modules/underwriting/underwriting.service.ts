import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnderwritingReview } from './entities/underwriting-review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { QuotesService } from '../quotes/quotes.service';
import { GroupsService } from '../groups/groups.service';
import { MembersService } from '../members/members.service';
import { RiskScoringService } from '../risk-scoring/risk-scoring.service';
import { QuoteStatus, UnderwritingDecision } from '../../common/enums';

@Injectable()
export class UnderwritingService {
  constructor(
    @InjectRepository(UnderwritingReview)
    private readonly reviewRepo: Repository<UnderwritingReview>,
    private readonly quotesService: QuotesService,
    private readonly groupsService: GroupsService,
    private readonly membersService: MembersService,
    private readonly riskScoringService: RiskScoringService,
  ) {}

  async submitForReview(tenantId: string, quoteId: string): Promise<UnderwritingReview> {
    const quote = await this.quotesService.findOne(tenantId, quoteId);
    const group = await this.groupsService.findOne(tenantId, quote.groupId);
    const members = await this.membersService.findByGroup(tenantId, quote.groupId);

    const riskAssessment = this.riskScoringService.assessGroupRisk(group, members);

    let autoDecision = UnderwritingDecision.REFER;
    if (riskAssessment.overallRiskScore < 0.3) {
      autoDecision = UnderwritingDecision.APPROVE;
    } else if (riskAssessment.overallRiskScore > 0.75) {
      autoDecision = UnderwritingDecision.REFER;
    } else {
      autoDecision = UnderwritingDecision.APPROVE;
    }

    const premiumAdjustmentFactor = riskAssessment.overallRiskScore > 0.55
      ? 1 + (riskAssessment.overallRiskScore - 0.55) * 0.5
      : 1.0;

    const review = this.reviewRepo.create({
      tenantId,
      quoteId,
      decision: autoDecision,
      riskTier: riskAssessment.riskTier,
      riskScore: riskAssessment.overallRiskScore,
      riskFactors: riskAssessment.specificFactors as any,
      largeClaimantCount: riskAssessment.largeClaimantCount,
      expectedLossRatio: riskAssessment.expectedLossRatio,
      recommendedAttachmentPoint: riskAssessment.recommendedSpecificAttachment,
      premiumAdjustmentFactor,
      conditions: [],
      exclusions: [],
    });

    const savedReview = await this.reviewRepo.save(review);

    const newStatus = autoDecision === UnderwritingDecision.APPROVE
      ? QuoteStatus.APPROVED
      : QuoteStatus.PENDING_REVIEW;
    await this.quotesService.updateStatus(tenantId, quoteId, newStatus);

    return savedReview;
  }

  async manualReview(tenantId: string, dto: CreateReviewDto): Promise<UnderwritingReview> {
    const quote = await this.quotesService.findOne(tenantId, dto.quoteId);

    const existingReview = await this.reviewRepo.findOne({
      where: { quoteId: dto.quoteId, tenantId },
      order: { createdAt: 'DESC' },
    });

    if (existingReview) {
      existingReview.decision = dto.decision;
      existingReview.notes = dto.notes || existingReview.notes;
      existingReview.reviewedBy = dto.reviewedBy || existingReview.reviewedBy;
      existingReview.reviewedAt = new Date();
      existingReview.conditions = dto.conditions || existingReview.conditions;
      existingReview.exclusions = dto.exclusions || existingReview.exclusions;

      const saved = await this.reviewRepo.save(existingReview);

      const quoteStatus = dto.decision === UnderwritingDecision.APPROVE
        ? QuoteStatus.APPROVED
        : dto.decision === UnderwritingDecision.DECLINE
        ? QuoteStatus.DECLINED
        : QuoteStatus.PENDING_REVIEW;

      await this.quotesService.updateStatus(tenantId, quote.id, quoteStatus, dto.notes);
      return saved;
    }

    throw new NotFoundException('No underwriting review found for this quote. Submit for review first.');
  }

  async findByQuote(tenantId: string, quoteId: string): Promise<UnderwritingReview> {
    const review = await this.reviewRepo.findOne({
      where: { quoteId, tenantId },
      relations: ['quote'],
      order: { createdAt: 'DESC' },
    });
    if (!review) throw new NotFoundException(`No review found for quote ${quoteId}`);
    return review;
  }

  async findAll(tenantId: string): Promise<UnderwritingReview[]> {
    return this.reviewRepo.find({
      where: { tenantId },
      relations: ['quote'],
      order: { createdAt: 'DESC' },
    });
  }
}
