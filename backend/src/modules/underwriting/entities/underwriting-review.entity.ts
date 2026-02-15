import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UnderwritingDecision, RiskTier } from '../../../common/enums';
import { Quote } from '../../quotes/entities/quote.entity';

@Entity('underwriting_reviews')
export class UnderwritingReview extends BaseEntity {
  @Column({ name: 'quote_id' })
  quoteId: string;

  @ManyToOne(() => Quote)
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ type: 'enum', enum: UnderwritingDecision })
  decision: UnderwritingDecision;

  @Column({ type: 'enum', enum: RiskTier, name: 'risk_tier' })
  riskTier: RiskTier;

  @Column({ name: 'risk_score', type: 'decimal', precision: 8, scale: 4 })
  riskScore: number;

  @Column({ name: 'risk_factors', type: 'jsonb' })
  riskFactors: Record<string, any>;

  @Column({ name: 'large_claimant_count', type: 'int', default: 0 })
  largeClaimantCount: number;

  @Column({ name: 'expected_loss_ratio', type: 'decimal', precision: 6, scale: 4, nullable: true })
  expectedLossRatio: number;

  @Column({ name: 'recommended_attachment_point', type: 'decimal', precision: 14, scale: 2, nullable: true })
  recommendedAttachmentPoint: number;

  @Column({ name: 'premium_adjustment_factor', type: 'decimal', precision: 6, scale: 4, default: 1.0 })
  premiumAdjustmentFactor: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  conditions: string[];

  @Column({ type: 'jsonb', nullable: true })
  exclusions: string[];
}
