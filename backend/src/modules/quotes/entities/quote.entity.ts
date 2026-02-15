import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CoverageType, QuoteStatus } from '../../../common/enums';
import { Group } from '../../groups/entities/group.entity';
import { Policy } from '../../policies/entities/policy.entity';

@Entity('quotes')
export class Quote extends BaseEntity {
  @Column({ name: 'quote_number', unique: true })
  quoteNumber: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.quotes)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'enum', enum: CoverageType, name: 'coverage_type' })
  coverageType: CoverageType;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.DRAFT })
  status: QuoteStatus;

  // Specific stop-loss parameters
  @Column({ name: 'specific_attachment_point', type: 'decimal', precision: 14, scale: 2, nullable: true })
  specificAttachmentPoint: number;

  @Column({ name: 'specific_max_liability', type: 'decimal', precision: 14, scale: 2, nullable: true })
  specificMaxLiability: number;

  @Column({ name: 'specific_premium_rate', type: 'decimal', precision: 10, scale: 6, nullable: true })
  specificPremiumRate: number;

  @Column({ name: 'specific_annual_premium', type: 'decimal', precision: 14, scale: 2, nullable: true })
  specificAnnualPremium: number;

  // Aggregate stop-loss parameters
  @Column({ name: 'aggregate_attachment_point', type: 'decimal', precision: 14, scale: 2, nullable: true })
  aggregateAttachmentPoint: number;

  @Column({ name: 'aggregate_attachment_factor', type: 'decimal', precision: 6, scale: 4, nullable: true })
  aggregateAttachmentFactor: number;

  @Column({ name: 'aggregate_max_liability', type: 'decimal', precision: 14, scale: 2, nullable: true })
  aggregateMaxLiability: number;

  @Column({ name: 'aggregate_premium_rate', type: 'decimal', precision: 10, scale: 6, nullable: true })
  aggregatePremiumRate: number;

  @Column({ name: 'aggregate_annual_premium', type: 'decimal', precision: 14, scale: 2, nullable: true })
  aggregateAnnualPremium: number;

  // Combined
  @Column({ name: 'total_annual_premium', type: 'decimal', precision: 14, scale: 2, nullable: true })
  totalAnnualPremium: number;

  @Column({ name: 'pepm_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pepmRate: number;

  // Risk assessment
  @Column({ name: 'risk_score', type: 'decimal', precision: 8, scale: 4, nullable: true })
  riskScore: number;

  @Column({ name: 'risk_factors', type: 'jsonb', nullable: true })
  riskFactors: Record<string, any>;

  @Column({ name: 'expected_claims', type: 'decimal', precision: 14, scale: 2, nullable: true })
  expectedClaims: number;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({ name: 'contract_period_months', type: 'int', default: 12 })
  contractPeriodMonths: number;

  @Column({ name: 'underwriter_notes', type: 'text', nullable: true })
  underwriterNotes: string;

  @Column({ name: 'quote_valid_until', type: 'date', nullable: true })
  quoteValidUntil: Date;

  @OneToOne(() => Policy, (policy) => policy.quote)
  policy: Policy;
}
