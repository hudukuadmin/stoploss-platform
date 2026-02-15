import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { GroupType, ContractType } from '../../../common/enums';
import { Member } from '../../members/entities/member.entity';
import { Quote } from '../../quotes/entities/quote.entity';
import { Policy } from '../../policies/entities/policy.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: GroupType, name: 'group_type' })
  groupType: GroupType;

  @Column({ type: 'enum', enum: ContractType, name: 'contract_type' })
  contractType: ContractType;

  @Column({ name: 'tax_id', nullable: true })
  taxId: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  region: string;

  @Column({ name: 'sic_code', nullable: true })
  sicCode: string;

  @Column({ name: 'member_count', type: 'int', default: 0 })
  memberCount: number;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate: Date;

  @Column({ name: 'renewal_date', type: 'date', nullable: true })
  renewalDate: Date;

  @Column({ name: 'historical_claims_data', type: 'jsonb', nullable: true })
  historicalClaimsData: Record<string, any>;

  @Column({ name: 'prior_coverage', type: 'jsonb', nullable: true })
  priorCoverage: Record<string, any>;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @OneToMany(() => Quote, (quote) => quote.group)
  quotes: Quote[];

  @OneToMany(() => Policy, (policy) => policy.group)
  policies: Policy[];
}
