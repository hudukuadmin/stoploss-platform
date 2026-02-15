import api from './client';
import type {
  Group,
  Member,
  Quote,
  Policy,
  UnderwritingReview,
  DashboardMetrics,
  CoverageType,
  QuoteStatus,
  PolicyStatus,
  UnderwritingDecision,
} from '../types';

export const groupsApi = {
  list: () => api.get<Group[]>('/groups').then((r) => r.data),
  get: (id: string) => api.get<Group>(`/groups/${id}`).then((r) => r.data),
  create: (data: Partial<Group>) => api.post<Group>('/groups', data).then((r) => r.data),
  update: (id: string, data: Partial<Group>) => api.put<Group>(`/groups/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/groups/${id}`),
};

export const membersApi = {
  listByGroup: (groupId: string) => api.get<Member[]>(`/members?groupId=${groupId}`).then((r) => r.data),
  get: (id: string) => api.get<Member>(`/members/${id}`).then((r) => r.data),
  create: (data: Partial<Member>) => api.post<Member>('/members', data).then((r) => r.data),
  bulkUpload: (groupId: string, members: Partial<Member>[]) =>
    api.post<{ created: number }>('/members/bulk', { groupId, members }).then((r) => r.data),
};

export const quotesApi = {
  list: () => api.get<Quote[]>('/quotes').then((r) => r.data),
  get: (id: string) => api.get<Quote>(`/quotes/${id}`).then((r) => r.data),
  generate: (data: {
    groupId: string;
    coverageType: CoverageType;
    effectiveDate: string;
    specificAttachmentPoint?: number;
    aggregateAttachmentFactor?: number;
    contractPeriodMonths?: number;
  }) => api.post<Quote>('/quotes', data).then((r) => r.data),
  updateStatus: (id: string, status: QuoteStatus, notes?: string) =>
    api.put<Quote>(`/quotes/${id}/status`, { status, notes }).then((r) => r.data),
};

export const policiesApi = {
  list: () => api.get<Policy[]>('/policies').then((r) => r.data),
  get: (id: string) => api.get<Policy>(`/policies/${id}`).then((r) => r.data),
  bind: (quoteId: string, boundBy?: string, terms?: Record<string, any>) =>
    api.post<Policy>('/policies/bind', { quoteId, boundBy, terms }).then((r) => r.data),
  updateStatus: (id: string, status: PolicyStatus) =>
    api.put<Policy>(`/policies/${id}/status`, { status }).then((r) => r.data),
};

export const underwritingApi = {
  list: () => api.get<UnderwritingReview[]>('/underwriting').then((r) => r.data),
  submitForReview: (quoteId: string) =>
    api.post<UnderwritingReview>(`/underwriting/submit/${quoteId}`).then((r) => r.data),
  getByQuote: (quoteId: string) =>
    api.get<UnderwritingReview>(`/underwriting/quote/${quoteId}`).then((r) => r.data),
  review: (data: {
    quoteId: string;
    decision: UnderwritingDecision;
    notes?: string;
    reviewedBy?: string;
    conditions?: string[];
    exclusions?: string[];
  }) => api.put<UnderwritingReview>('/underwriting/review', data).then((r) => r.data),
};

export const analyticsApi = {
  dashboard: () => api.get<DashboardMetrics>('/analytics/dashboard').then((r) => r.data),
};
