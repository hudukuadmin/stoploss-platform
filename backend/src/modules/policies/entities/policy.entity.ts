import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CoverageType, PolicyStatus } from '../../../common/enums';
import { Group } from '../../groups/entities/group.entity';
import { Quote } from '../../quotes/entities/quote.entity';

@Entity('policies')
export class Policy extends BaseEntity {
  @Column({ name: 'policy_number', unique: true })
  policyNumber: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.policies)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'quote_id' })
  quoteId: string;

  @OneToOne(() => Quote, (quote) => quote.policy)
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ type: 'enum', enum: CoverageType, name: 'coverage_type' })
  coverageType: CoverageType;

  @Column({ type: 'enum', enum: PolicyStatus, default: PolicyStatus.PENDING })
  status: PolicyStatus;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: Date;

  @Column({ name: 'termination_date', type: 'date' })
  terminationDate: Date;

  @Column({ name: 'specific_attachment_point', type: 'decimal', precision: 14, scale: 2, nullable: true })
  specificAttachmentPoint: number;

  @Column({ name: 'specific_max_liability', type: 'decimal', precision: 14, scale: 2, nullable: true })
  specificMaxLiability: number;

  @Column({ name: 'aggregate_attachment_point', type: 'decimal', precision: 14, scale: 2, nullable: true })
  aggregateAttachmentPoint: number;

  @Column({ name: 'aggregate_attachment_factor', type: 'decimal', precision: 6, scale: 4, nullable: true })
  aggregateAttachmentFactor: number;

  @Column({ name: 'aggregate_max_liability', type: 'decimal', precision: 14, scale: 2, nullable: true })
  aggregateMaxLiability: number;

  @Column({ name: 'total_annual_premium', type: 'decimal', precision: 14, scale: 2 })
  totalAnnualPremium: number;

  @Column({ name: 'pepm_rate', type: 'decimal', precision: 10, scale: 2 })
  pepmRate: number;

  @Column({ type: 'jsonb', nullable: true })
  terms: Record<string, any>;

  @Column({ name: 'bound_by', nullable: true })
  boundBy: string;

  @Column({ name: 'bound_at', type: 'timestamp', nullable: true })
  boundAt: Date;
}
