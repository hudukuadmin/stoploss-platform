export const CoverageType = {
  SPECIFIC: 'specific',
  AGGREGATE: 'aggregate',
  BOTH: 'both',
} as const;
export type CoverageType = (typeof CoverageType)[keyof typeof CoverageType];

export const QuoteStatus = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  BOUND: 'bound',
} as const;
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const PolicyStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;
export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];

export const UnderwritingDecision = {
  APPROVE: 'approve',
  DECLINE: 'decline',
  REFER: 'refer',
  REQUEST_INFO: 'request_info',
} as const;
export type UnderwritingDecision = (typeof UnderwritingDecision)[keyof typeof UnderwritingDecision];

export const RiskTier = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;
export type RiskTier = (typeof RiskTier)[keyof typeof RiskTier];

export const GroupType = {
  ACO: 'aco',
  HEALTH_PLAN: 'health_plan',
  TPA: 'tpa',
  EMPLOYER: 'employer',
  PROVIDER_GROUP: 'provider_group',
} as const;
export type GroupType = (typeof GroupType)[keyof typeof GroupType];

export const ContractType = {
  FULL_RISK: 'full_risk',
  SHARED_SAVINGS: 'shared_savings',
  SHARED_RISK: 'shared_risk',
  GLOBAL_CAPITATION: 'global_capitation',
} as const;
export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export interface Group {
  id: string;
  name: string;
  groupType: GroupType;
  contractType: ContractType;
  taxId?: string;
  state?: string;
  region?: string;
  sicCode?: string;
  memberCount: number;
  effectiveDate?: string;
  renewalDate?: string;
  historicalClaimsData?: Record<string, any>;
  priorCoverage?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  memberIdExternal: string;
  groupId: string;
  dateOfBirth: string;
  gender: string;
  zipCode?: string;
  riskScore?: number;
  chronicConditions?: string[];
  historicalClaimsAmount?: number;
  largeClaimantFlag: boolean;
  diagnosisCodes?: string[];
  planType?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  groupId: string;
  group?: Group;
  coverageType: CoverageType;
  status: QuoteStatus;
  specificAttachmentPoint?: number;
  specificMaxLiability?: number;
  specificPremiumRate?: number;
  specificAnnualPremium?: number;
  aggregateAttachmentPoint?: number;
  aggregateAttachmentFactor?: number;
  aggregateMaxLiability?: number;
  aggregatePremiumRate?: number;
  aggregateAnnualPremium?: number;
  totalAnnualPremium?: number;
  pepmRate?: number;
  riskScore?: number;
  riskFactors?: Record<string, number>;
  expectedClaims?: number;
  effectiveDate: string;
  expirationDate: string;
  contractPeriodMonths: number;
  underwriterNotes?: string;
  quoteValidUntil?: string;
  createdAt: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  groupId: string;
  group?: Group;
  quoteId: string;
  quote?: Quote;
  coverageType: CoverageType;
  status: PolicyStatus;
  effectiveDate: string;
  terminationDate: string;
  specificAttachmentPoint?: number;
  specificMaxLiability?: number;
  aggregateAttachmentPoint?: number;
  aggregateAttachmentFactor?: number;
  aggregateMaxLiability?: number;
  totalAnnualPremium: number;
  pepmRate: number;
  terms?: Record<string, any>;
  boundBy?: string;
  boundAt?: string;
  createdAt: string;
}

export interface UnderwritingReview {
  id: string;
  quoteId: string;
  quote?: Quote;
  decision: UnderwritingDecision;
  riskTier: RiskTier;
  riskScore: number;
  riskFactors: Record<string, number>;
  largeClaimantCount: number;
  expectedLossRatio?: number;
  recommendedAttachmentPoint?: number;
  premiumAdjustmentFactor: number;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  conditions?: string[];
  exclusions?: string[];
  createdAt: string;
}

export interface DashboardMetrics {
  totalGroups: number;
  totalActiveQuotes: number;
  totalActivePolicies: number;
  totalPremiumInForce: number;
  totalExpectedClaims: number;
  averageRiskScore: number;
  averagePepmRate: number;
  quotesByStatus: Record<string, number>;
  policiesByStatus: Record<string, number>;
  coverageBreakdown: Record<string, number>;
  riskDistribution: Record<string, number>;
  premiumTrend: Array<{ month: string; premium: number }>;
}
