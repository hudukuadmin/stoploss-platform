import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../quotes/entities/quote.entity';
import { Policy } from '../policies/entities/policy.entity';
import { Group } from '../groups/entities/group.entity';

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

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Policy)
    private readonly policyRepo: Repository<Policy>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
    const [groups, quotes, policies] = await Promise.all([
      this.groupRepo.find({ where: { tenantId } }),
      this.quoteRepo.find({ where: { tenantId } }),
      this.policyRepo.find({ where: { tenantId } }),
    ]);

    const activePolicies = policies.filter((p) => p.status === 'active');
    const totalPremiumInForce = activePolicies.reduce(
      (sum, p) => sum + Number(p.totalAnnualPremium),
      0,
    );

    const quotesByStatus: Record<string, number> = {};
    quotes.forEach((q) => {
      quotesByStatus[q.status] = (quotesByStatus[q.status] || 0) + 1;
    });

    const policiesByStatus: Record<string, number> = {};
    policies.forEach((p) => {
      policiesByStatus[p.status] = (policiesByStatus[p.status] || 0) + 1;
    });

    const coverageBreakdown: Record<string, number> = {};
    policies.forEach((p) => {
      coverageBreakdown[p.coverageType] = (coverageBreakdown[p.coverageType] || 0) + 1;
    });

    const riskScores = quotes.filter((q) => q.riskScore).map((q) => Number(q.riskScore));
    const avgRiskScore = riskScores.length
      ? riskScores.reduce((sum, s) => sum + s, 0) / riskScores.length
      : 0;

    const riskDistribution: Record<string, number> = { low: 0, moderate: 0, high: 0, very_high: 0 };
    riskScores.forEach((score) => {
      if (score < 0.3) riskDistribution['low']++;
      else if (score < 0.55) riskDistribution['moderate']++;
      else if (score < 0.75) riskDistribution['high']++;
      else riskDistribution['very_high']++;
    });

    const pepmRates = activePolicies.map((p) => Number(p.pepmRate)).filter((r) => r > 0);
    const avgPepmRate = pepmRates.length
      ? pepmRates.reduce((sum, r) => sum + r, 0) / pepmRates.length
      : 0;

    const totalExpectedClaims = quotes.reduce(
      (sum, q) => sum + Number(q.expectedClaims || 0),
      0,
    );

    return {
      totalGroups: groups.length,
      totalActiveQuotes: quotes.filter((q) => !['expired', 'declined', 'bound'].includes(q.status)).length,
      totalActivePolicies: activePolicies.length,
      totalPremiumInForce: Math.round(totalPremiumInForce * 100) / 100,
      totalExpectedClaims: Math.round(totalExpectedClaims * 100) / 100,
      averageRiskScore: Math.round(avgRiskScore * 10000) / 10000,
      averagePepmRate: Math.round(avgPepmRate * 100) / 100,
      quotesByStatus,
      policiesByStatus,
      coverageBreakdown,
      riskDistribution,
      premiumTrend: [],
    };
  }
}
