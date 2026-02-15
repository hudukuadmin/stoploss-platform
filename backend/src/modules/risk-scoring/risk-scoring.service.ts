import { Injectable } from '@nestjs/common';
import { RiskTier } from '../../common/enums';
import { Group } from '../groups/entities/group.entity';
import { Member } from '../members/entities/member.entity';

export interface RiskAssessment {
  overallRiskScore: number;
  riskTier: RiskTier;
  expectedClaimsCost: number;
  largeClaimantCount: number;
  specificFactors: {
    demographicScore: number;
    historicalClaimsScore: number;
    chronicConditionScore: number;
    largeClaimantScore: number;
    geographicScore: number;
    industryScore: number;
  };
  recommendedSpecificAttachment: number;
  recommendedAggregateAttachmentFactor: number;
  expectedLossRatio: number;
}

interface GeographicFactors {
  [key: string]: number;
}

interface IndustryFactors {
  [key: string]: number;
}

const GEOGRAPHIC_COST_FACTORS: GeographicFactors = {
  CA: 1.25, NY: 1.30, FL: 1.10, TX: 1.05, IL: 1.15,
  PA: 1.12, OH: 1.00, GA: 1.02, NC: 1.00, MI: 1.08,
  NJ: 1.22, VA: 1.05, WA: 1.18, AZ: 1.03, MA: 1.28,
  DEFAULT: 1.05,
};

const SIC_INDUSTRY_FACTORS: IndustryFactors = {
  '15': 1.15, // Construction
  '20': 1.05, // Food manufacturing
  '28': 1.00, // Chemicals
  '35': 1.08, // Industrial machinery
  '48': 1.02, // Communications
  '60': 0.95, // Banking
  '73': 0.92, // Business services
  '80': 1.10, // Health services
  DEFAULT: 1.00,
};

@Injectable()
export class RiskScoringService {
  assessGroupRisk(group: Group, members: Member[]): RiskAssessment {
    const demographicScore = this.calculateDemographicScore(members);
    const historicalClaimsScore = this.calculateHistoricalClaimsScore(group, members);
    const chronicConditionScore = this.calculateChronicConditionScore(members);
    const largeClaimantScore = this.calculateLargeClaimantScore(members);
    const geographicScore = this.calculateGeographicScore(group);
    const industryScore = this.calculateIndustryScore(group);

    const overallRiskScore =
      demographicScore * 0.15 +
      historicalClaimsScore * 0.30 +
      chronicConditionScore * 0.20 +
      largeClaimantScore * 0.20 +
      geographicScore * 0.08 +
      industryScore * 0.07;

    const riskTier = this.determineRiskTier(overallRiskScore);
    const memberCount = members.length || group.memberCount || 1;
    const expectedClaimsCost = this.calculateExpectedClaims(overallRiskScore, memberCount);
    const largeClaimantCount = members.filter((m) => m.largeClaimantFlag).length;

    return {
      overallRiskScore: Math.round(overallRiskScore * 10000) / 10000,
      riskTier,
      expectedClaimsCost,
      largeClaimantCount,
      specificFactors: {
        demographicScore: Math.round(demographicScore * 10000) / 10000,
        historicalClaimsScore: Math.round(historicalClaimsScore * 10000) / 10000,
        chronicConditionScore: Math.round(chronicConditionScore * 10000) / 10000,
        largeClaimantScore: Math.round(largeClaimantScore * 10000) / 10000,
        geographicScore: Math.round(geographicScore * 10000) / 10000,
        industryScore: Math.round(industryScore * 10000) / 10000,
      },
      recommendedSpecificAttachment: this.recommendSpecificAttachment(overallRiskScore, memberCount),
      recommendedAggregateAttachmentFactor: this.recommendAggregateAttachmentFactor(overallRiskScore),
      expectedLossRatio: this.calculateExpectedLossRatio(overallRiskScore),
    };
  }

  private calculateDemographicScore(members: Member[]): number {
    if (!members.length) return 0.5;

    const now = new Date();
    const ages = members.map((m) => {
      const dob = new Date(m.dateOfBirth);
      return (now.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    });

    const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const ageRiskFactor = avgAge < 30 ? 0.3 : avgAge < 40 ? 0.5 : avgAge < 50 ? 0.7 : avgAge < 60 ? 0.85 : 0.95;

    const genderRatio = members.filter((m) => m.gender === 'F').length / members.length;
    const genderFactor = 0.9 + genderRatio * 0.2;

    return Math.min(1, ageRiskFactor * genderFactor);
  }

  private calculateHistoricalClaimsScore(group: Group, members: Member[]): number {
    const memberClaims = members
      .filter((m) => m.historicalClaimsAmount)
      .map((m) => Number(m.historicalClaimsAmount));

    if (!memberClaims.length) {
      const historicalData = group.historicalClaimsData;
      if (historicalData?.totalClaims && historicalData?.memberMonths) {
        const pmpm = historicalData.totalClaims / historicalData.memberMonths;
        return Math.min(1, pmpm / 1500);
      }
      return 0.5;
    }

    const totalClaims = memberClaims.reduce((sum, c) => sum + c, 0);
    const avgClaimPerMember = totalClaims / members.length;
    const annualizedPMPM = avgClaimPerMember / 12;

    return Math.min(1, annualizedPMPM / 1500);
  }

  private calculateChronicConditionScore(members: Member[]): number {
    if (!members.length) return 0.3;

    const membersWithConditions = members.filter(
      (m) => m.chronicConditions && m.chronicConditions.length > 0,
    );

    const prevalenceRate = membersWithConditions.length / members.length;

    const totalConditions = membersWithConditions.reduce(
      (sum, m) => sum + (m.chronicConditions?.length || 0),
      0,
    );
    const avgConditionsPerAffected = membersWithConditions.length > 0
      ? totalConditions / membersWithConditions.length
      : 0;

    const comorbidityFactor = Math.min(1, avgConditionsPerAffected / 5);

    return Math.min(1, (prevalenceRate * 0.6 + comorbidityFactor * 0.4));
  }

  private calculateLargeClaimantScore(members: Member[]): number {
    if (!members.length) return 0.2;

    const largeClaimants = members.filter((m) => m.largeClaimantFlag);
    const largeClaimantRate = largeClaimants.length / members.length;

    const highCostMembers = members.filter(
      (m) => Number(m.historicalClaimsAmount) > 100000,
    );
    const highCostRate = highCostMembers.length / members.length;

    return Math.min(1, largeClaimantRate * 5 + highCostRate * 3);
  }

  private calculateGeographicScore(group: Group): number {
    const stateFactor = GEOGRAPHIC_COST_FACTORS[group.state] || GEOGRAPHIC_COST_FACTORS['DEFAULT'];
    return Math.min(1, (stateFactor - 0.8) / 0.6);
  }

  private calculateIndustryScore(group: Group): number {
    if (!group.sicCode) return 0.5;
    const sicPrefix = group.sicCode.substring(0, 2);
    const factor = SIC_INDUSTRY_FACTORS[sicPrefix] || SIC_INDUSTRY_FACTORS['DEFAULT'];
    return Math.min(1, (factor - 0.8) / 0.4);
  }

  private determineRiskTier(score: number): RiskTier {
    if (score < 0.3) return RiskTier.LOW;
    if (score < 0.55) return RiskTier.MODERATE;
    if (score < 0.75) return RiskTier.HIGH;
    return RiskTier.VERY_HIGH;
  }

  private calculateExpectedClaims(riskScore: number, memberCount: number): number {
    const basePMPM = 450;
    const riskAdjustedPMPM = basePMPM * (0.5 + riskScore * 1.5);
    return Math.round(riskAdjustedPMPM * memberCount * 12 * 100) / 100;
  }

  private recommendSpecificAttachment(riskScore: number, memberCount: number): number {
    const baseAttachment = memberCount < 100 ? 150000 : memberCount < 500 ? 200000 : 250000;

    if (riskScore < 0.3) return baseAttachment * 1.0;
    if (riskScore < 0.55) return baseAttachment * 0.9;
    if (riskScore < 0.75) return baseAttachment * 0.8;
    return baseAttachment * 0.7;
  }

  private recommendAggregateAttachmentFactor(riskScore: number): number {
    if (riskScore < 0.3) return 1.25;
    if (riskScore < 0.55) return 1.20;
    if (riskScore < 0.75) return 1.15;
    return 1.10;
  }

  private calculateExpectedLossRatio(riskScore: number): number {
    const baseLossRatio = 0.65;
    return Math.min(0.95, baseLossRatio + riskScore * 0.25);
  }
}
