import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface NarrativeRequest {
  riskScore: number;
  riskTier: string;
  decision: string;
  riskFactors: Record<string, number>;
  largeClaimantCount: number;
  expectedLossRatio: number;
  recommendedAttachmentPoint: number;
  premiumAdjustmentFactor: number;
  quoteNumber?: string;
  coverageType?: string;
  groupName?: string;
}

export interface NarrativeResponse {
  summary: string;
  keyDrivers: string[];
  recommendation: string;
  generatedBy: 'ai' | 'rules';
}

@Injectable()
export class AiNarrativeService {
  private readonly logger = new Logger(AiNarrativeService.name);
  private readonly openaiApiKey: string | undefined;
  private readonly openaiBaseUrl: string;
  private readonly openaiModel: string;

  constructor(private readonly configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openaiBaseUrl = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com/v1';
    this.openaiModel = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';
  }

  async generateNarrative(request: NarrativeRequest): Promise<NarrativeResponse> {
    if (this.openaiApiKey) {
      try {
        return await this.generateWithLLM(request);
      } catch (error) {
        this.logger.warn('LLM narrative generation failed, falling back to rules engine', error);
      }
    }
    return this.generateWithRules(request);
  }

  private async generateWithLLM(request: NarrativeRequest): Promise<NarrativeResponse> {
    const prompt = this.buildPrompt(request);

    const response = await fetch(`${this.openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: `You are a senior stop-loss insurance underwriting analyst. Generate concise, professional risk narratives for underwriting reviews. Respond in JSON format with keys: "summary" (2-3 sentence overview), "keyDrivers" (array of 3-5 short bullet strings), "recommendation" (1-2 sentence action recommendation).`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      summary: content.summary,
      keyDrivers: content.keyDrivers,
      recommendation: content.recommendation,
      generatedBy: 'ai',
    };
  }

  private buildPrompt(req: NarrativeRequest): string {
    return `Analyze this stop-loss underwriting review:

Group: ${req.groupName || 'N/A'}
Quote: ${req.quoteNumber || 'N/A'}
Coverage Type: ${req.coverageType || 'N/A'}
Risk Score: ${(req.riskScore * 100).toFixed(1)}%
Risk Tier: ${req.riskTier}
Decision: ${req.decision}
Expected Loss Ratio: ${(req.expectedLossRatio * 100).toFixed(1)}%
Large Claimant Count: ${req.largeClaimantCount}
Recommended Attachment Point: $${req.recommendedAttachmentPoint?.toLocaleString()}
Premium Adjustment Factor: ${(req.premiumAdjustmentFactor * 100).toFixed(1)}%

Risk Factor Breakdown:
${Object.entries(req.riskFactors).map(([k, v]) => `- ${k}: ${(v * 100).toFixed(1)}%`).join('\n')}

Generate a professional underwriting narrative.`;
  }

  private generateWithRules(req: NarrativeRequest): NarrativeResponse {
    const riskPct = (req.riskScore * 100).toFixed(1);
    const lossRatioPct = (req.expectedLossRatio * 100).toFixed(1);
    const tierLabel = req.riskTier.replace(/_/g, ' ');

    const sortedFactors = Object.entries(req.riskFactors)
      .sort(([, a], [, b]) => b - a);
    const topFactors = sortedFactors.slice(0, 3);
    const topFactorNames = topFactors.map(([k]) =>
      k.replace(/([A-Z])/g, ' $1').replace(/Score$/i, '').trim().toLowerCase(),
    );

    const summary = this.buildSummary(req, riskPct, tierLabel, lossRatioPct, topFactorNames);
    const keyDrivers = this.buildKeyDrivers(req, sortedFactors);
    const recommendation = this.buildRecommendation(req, tierLabel);

    return { summary, keyDrivers, recommendation, generatedBy: 'rules' };
  }

  private buildSummary(
    req: NarrativeRequest, riskPct: string, tierLabel: string,
    lossRatioPct: string, topFactorNames: string[],
  ): string {
    const groupRef = req.groupName ? `for ${req.groupName} ` : '';
    const quoteRef = req.quoteNumber ? `(${req.quoteNumber}) ` : '';

    let opener: string;
    if (req.riskScore < 0.3) {
      opener = `This group ${groupRef}${quoteRef}presents a favorable risk profile with an overall score of ${riskPct}%, placing it in the ${tierLabel} risk tier.`;
    } else if (req.riskScore < 0.55) {
      opener = `The underwriting review ${groupRef}${quoteRef}indicates a moderate risk profile with a composite score of ${riskPct}%, classified as ${tierLabel} risk.`;
    } else if (req.riskScore < 0.75) {
      opener = `This submission ${groupRef}${quoteRef}carries an elevated risk profile at ${riskPct}%, falling within the ${tierLabel} tier and warranting careful evaluation.`;
    } else {
      opener = `This group ${groupRef}${quoteRef}presents significant risk concerns with a score of ${riskPct}%, placing it in the ${tierLabel} category.`;
    }

    const driverSentence = `The primary risk drivers are ${topFactorNames.slice(0, 2).join(' and ')}, with an expected loss ratio of ${lossRatioPct}%.`;

    return `${opener} ${driverSentence}`;
  }

  private buildKeyDrivers(req: NarrativeRequest, sortedFactors: [string, number][]): string[] {
    const drivers: string[] = [];

    for (const [key, value] of sortedFactors.slice(0, 4)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/Score$/i, '').trim();
      const pct = (value * 100).toFixed(0);
      let severity: string;
      if (value < 0.3) severity = 'favorable';
      else if (value < 0.5) severity = 'moderate';
      else if (value < 0.7) severity = 'elevated';
      else severity = 'high';
      drivers.push(`${label}: ${pct}% (${severity})`);
    }

    if (req.largeClaimantCount > 0) {
      const intensity = req.largeClaimantCount > 8 ? 'significant' : req.largeClaimantCount > 4 ? 'notable' : 'manageable';
      drivers.push(`${req.largeClaimantCount} large claimant(s) identified — ${intensity} concentration risk`);
    }

    return drivers;
  }

  private buildRecommendation(req: NarrativeRequest, tierLabel: string): string {
    if (req.decision === 'approve' && req.riskScore < 0.3) {
      return `Recommend binding at standard rates. The ${tierLabel} risk profile supports the current attachment point of $${req.recommendedAttachmentPoint?.toLocaleString()}.`;
    }
    if (req.decision === 'approve' && req.riskScore < 0.55) {
      return `Approved with a ${(req.premiumAdjustmentFactor * 100).toFixed(0)}% premium adjustment. Monitor claims development closely during the first policy year.`;
    }
    if (req.decision === 'refer') {
      return `Referred for senior underwriter review. Consider increasing the specific attachment point to $${req.recommendedAttachmentPoint?.toLocaleString()} and applying additional premium loading given the ${tierLabel} risk classification.`;
    }
    if (req.decision === 'decline') {
      return `Declined due to unfavorable risk characteristics. The expected loss ratio of ${(req.expectedLossRatio * 100).toFixed(1)}% exceeds acceptable thresholds for the requested coverage structure.`;
    }
    return `Additional information requested before a final determination can be made. The current ${tierLabel} risk profile requires further documentation to complete the assessment.`;
  }
}
