import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('members')
export class Member extends BaseEntity {
  @Column({ name: 'member_id_external' })
  memberIdExternal: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  @Column({ name: 'relationship_code', nullable: true })
  relationshipCode: string;

  @Column({ name: 'risk_score', type: 'decimal', precision: 8, scale: 4, nullable: true })
  riskScore: number;

  @Column({ name: 'chronic_conditions', type: 'jsonb', nullable: true })
  chronicConditions: string[];

  @Column({ name: 'historical_claims_amount', type: 'decimal', precision: 14, scale: 2, nullable: true })
  historicalClaimsAmount: number;

  @Column({ name: 'large_claimant_flag', default: false })
  largeClaimantFlag: boolean;

  @Column({ name: 'diagnosis_codes', type: 'jsonb', nullable: true })
  diagnosisCodes: string[];

  @Column({ name: 'enrollment_date', type: 'date', nullable: true })
  enrollmentDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ name: 'plan_type', nullable: true })
  planType: string;
}
