export enum CoverageType {
  SPECIFIC = 'specific',
  AGGREGATE = 'aggregate',
  BOTH = 'both',
}

export enum QuoteStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  BOUND = 'bound',
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export enum UnderwritingDecision {
  APPROVE = 'approve',
  DECLINE = 'decline',
  REFER = 'refer',
  REQUEST_INFO = 'request_info',
}

export enum RiskTier {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export enum GroupType {
  ACO = 'aco',
  HEALTH_PLAN = 'health_plan',
  TPA = 'tpa',
  EMPLOYER = 'employer',
  PROVIDER_GROUP = 'provider_group',
}

export enum ContractType {
  FULL_RISK = 'full_risk',
  SHARED_SAVINGS = 'shared_savings',
  SHARED_RISK = 'shared_risk',
  GLOBAL_CAPITATION = 'global_capitation',
}
