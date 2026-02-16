import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { UnderwritingReview } from '../types';
import { UnderwritingDecision } from '../types';
import { underwritingApi, aiNarrativeApi } from '../api/services';
import type { NarrativeResponse } from '../api/services';
import { Sparkles } from 'lucide-react';

const mockReviews: UnderwritingReview[] = [
  {
    id: 'ur-1',
    quoteId: '1',
    quote: { id: '1', quoteNumber: 'BSQ-2026-001', groupId: '1', coverageType: 'both', status: 'approved', effectiveDate: '2026-03-01', expirationDate: '2027-02-28', contractPeriodMonths: 12, createdAt: '2026-01-15T10:00:00Z' },
    decision: 'approve' as any,
    riskTier: 'low' as any,
    riskScore: 0.42,
    riskFactors: { demographicScore: 0.45, historicalClaimsScore: 0.40, chronicConditionScore: 0.35, largeClaimantScore: 0.18, geographicScore: 0.55, industryScore: 0.48 },
    largeClaimantCount: 2,
    expectedLossRatio: 0.74,
    recommendedAttachmentPoint: 250000,
    premiumAdjustmentFactor: 1.0,
    notes: 'Low risk group with favorable claims history. Approved at standard rates.',
    reviewedBy: 'Dr. Sarah Chen',
    reviewedAt: '2026-01-18T14:30:00Z',
    createdAt: '2026-01-16T09:00:00Z',
  },
  {
    id: 'ur-2',
    quoteId: '2',
    quote: { id: '2', quoteNumber: 'BSQ-2026-002', groupId: '2', coverageType: 'specific', status: 'pending_review', effectiveDate: '2026-04-01', expirationDate: '2027-03-31', contractPeriodMonths: 12, createdAt: '2026-01-20T14:30:00Z' },
    decision: 'refer' as any,
    riskTier: 'moderate' as any,
    riskScore: 0.55,
    riskFactors: { demographicScore: 0.58, historicalClaimsScore: 0.52, chronicConditionScore: 0.50, largeClaimantScore: 0.35, geographicScore: 0.62, industryScore: 0.55 },
    largeClaimantCount: 5,
    expectedLossRatio: 0.82,
    recommendedAttachmentPoint: 200000,
    premiumAdjustmentFactor: 1.12,
    notes: 'Moderate risk with elevated large claimant count. Referred for senior review. Consider increasing attachment point.',
    reviewedBy: 'James Mitchell',
    reviewedAt: '2026-01-22T10:15:00Z',
    createdAt: '2026-01-21T08:00:00Z',
  },
  {
    id: 'ur-3',
    quoteId: '3',
    quote: { id: '3', quoteNumber: 'BSQ-2026-003', groupId: '3', coverageType: 'aggregate', status: 'pending_review', effectiveDate: '2026-05-01', expirationDate: '2027-04-30', contractPeriodMonths: 12, createdAt: '2026-02-01T09:15:00Z' },
    decision: 'approve' as any,
    riskTier: 'low' as any,
    riskScore: 0.38,
    riskFactors: { demographicScore: 0.40, historicalClaimsScore: 0.35, chronicConditionScore: 0.30, largeClaimantScore: 0.15, geographicScore: 0.50, industryScore: 0.42 },
    largeClaimantCount: 3,
    expectedLossRatio: 0.68,
    recommendedAttachmentPoint: 220000,
    premiumAdjustmentFactor: 0.95,
    notes: 'Excellent claims history and low chronic condition prevalence. Approved with 5% premium discount.',
    reviewedBy: 'Dr. Sarah Chen',
    reviewedAt: '2026-02-03T11:45:00Z',
    createdAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 'ur-4',
    quoteId: '5',
    quote: { id: '5', quoteNumber: 'BSQ-2026-005', groupId: '2', coverageType: 'specific', status: 'declined', effectiveDate: '2026-03-01', expirationDate: '2027-02-28', contractPeriodMonths: 12, createdAt: '2026-01-25T16:45:00Z' },
    decision: 'decline' as any,
    riskTier: 'very_high' as any,
    riskScore: 0.72,
    riskFactors: { demographicScore: 0.70, historicalClaimsScore: 0.75, chronicConditionScore: 0.68, largeClaimantScore: 0.58, geographicScore: 0.72, industryScore: 0.65 },
    largeClaimantCount: 11,
    expectedLossRatio: 1.05,
    recommendedAttachmentPoint: 350000,
    premiumAdjustmentFactor: 1.35,
    notes: 'Very high risk profile with expected loss ratio exceeding 100%. High large claimant concentration. Declined per underwriting guidelines.',
    reviewedBy: 'James Mitchell',
    reviewedAt: '2026-01-27T09:30:00Z',
    createdAt: '2026-01-26T08:00:00Z',
  },
  {
    id: 'ur-5',
    quoteId: '6',
    quote: { id: '6', quoteNumber: 'BSQ-2026-006', groupId: '3', coverageType: 'both', status: 'draft', effectiveDate: '2026-06-01', expirationDate: '2027-05-31', contractPeriodMonths: 12, createdAt: '2026-02-10T08:20:00Z' },
    decision: 'request_info' as any,
    riskTier: 'moderate' as any,
    riskScore: 0.46,
    riskFactors: { demographicScore: 0.48, historicalClaimsScore: 0.44, chronicConditionScore: 0.42, largeClaimantScore: 0.25, geographicScore: 0.52, industryScore: 0.46 },
    largeClaimantCount: 4,
    expectedLossRatio: 0.78,
    recommendedAttachmentPoint: 230000,
    premiumAdjustmentFactor: 1.05,
    notes: 'Borderline moderate risk. Requesting 24 months of detailed claims run-out data and updated census before final determination.',
    createdAt: '2026-02-11T09:00:00Z',
  },
];

export default function UnderwritingPage() {
  const [reviews, setReviews] = useState<UnderwritingReview[]>(mockReviews);
  const [selected, setSelected] = useState<UnderwritingReview | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [narrativeError, setNarrativeError] = useState<string | null>(null);

  useEffect(() => {
    underwritingApi.list().then(setReviews).catch(() => {});
  }, []);

  const handleDecision = async (quoteId: string, decision: UnderwritingDecision) => {
    try {
      await underwritingApi.review({
        quoteId,
        decision,
        reviewedBy: 'Underwriter',
        notes: `Manual ${decision} decision`,
      });
      const updated = await underwritingApi.list();
      setReviews(updated);
    } catch {}
  };

  const handleGenerateNarrative = async (review: UnderwritingReview) => {
    setNarrativeLoading(true);
    setNarrativeError(null);
    setNarrative(null);
    try {
      const result = await aiNarrativeApi.generate({
        riskScore: review.riskScore,
        riskTier: review.riskTier,
        decision: review.decision,
        riskFactors: review.riskFactors,
        largeClaimantCount: review.largeClaimantCount,
        expectedLossRatio: review.expectedLossRatio ?? 0,
        recommendedAttachmentPoint: review.recommendedAttachmentPoint ?? 0,
        premiumAdjustmentFactor: review.premiumAdjustmentFactor,
        quoteNumber: review.quote?.quoteNumber,
        coverageType: review.quote?.coverageType,
      });
      setNarrative(result);
    } catch {
      setNarrativeError('Failed to generate narrative. Please try again.');
    } finally {
      setNarrativeLoading(false);
    }
  };

  const formatCurrency = (val: number | undefined) =>
    val != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val) : '-';

  const btnStyle = (bg: string) => ({
    padding: '6px 14px', background: bg, color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 12, fontWeight: 600 as const, cursor: 'pointer',
  });

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Underwriting Workbench
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <Card>
          {reviews.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
              No underwriting reviews yet. Submit a quote for review from the Quotes page.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  {['Quote', 'Risk Tier', 'Decision', 'Risk Score', 'Loss Ratio', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === review.id ? '#f6f1f9' : 'transparent' }}
                    onClick={() => { setSelected(review); setNarrative(null); setNarrativeError(null); }}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>{review.quote?.quoteNumber || review.quoteId.slice(0, 8)}</td>
                    <td style={{ padding: '10px 8px' }}><StatusBadge status={review.riskTier} /></td>
                    <td style={{ padding: '10px 8px' }}><StatusBadge status={review.decision} /></td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{(review.riskScore * 100).toFixed(1)}%</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{review.expectedLossRatio ? (review.expectedLossRatio * 100).toFixed(1) + '%' : '-'}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={(e) => { e.stopPropagation(); handleDecision(review.quoteId, UnderwritingDecision.APPROVE); }} style={btnStyle('#22c55e')}>Approve</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDecision(review.quoteId, UnderwritingDecision.DECLINE); }} style={btnStyle('#ef4444')}>Decline</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {selected && (
          <Card title="Review Details">
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Risk Tier</div>
                  <StatusBadge status={selected.riskTier} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Decision</div>
                  <StatusBadge status={selected.decision} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Risk Score</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{(selected.riskScore * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Premium Adjustment</div>
                  <div style={{ fontWeight: 600 }}>{(selected.premiumAdjustmentFactor * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Large Claimants</div>
                  <div style={{ fontWeight: 600 }}>{selected.largeClaimantCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Expected Loss Ratio</div>
                  <div style={{ fontWeight: 600 }}>{selected.expectedLossRatio ? (selected.expectedLossRatio * 100).toFixed(1) + '%' : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Recommended Attachment</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selected.recommendedAttachmentPoint)}</div>
                </div>
              </div>

              {selected.riskFactors && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Risk Factors</h4>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                    {Object.entries(selected.riskFactors).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 80, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                            <div style={{
                              width: `${Math.min(Number(val) * 100, 100)}%`,
                              height: '100%',
                              background: Number(val) < 0.3 ? '#22c55e' : Number(val) < 0.6 ? '#eab308' : '#ef4444',
                              borderRadius: 3,
                            }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{(Number(val) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selected.notes && (
                <>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Notes</h4>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{selected.notes}</p>
                </>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                  AI Risk Narrative
                </h4>
                <button
                  onClick={() => handleGenerateNarrative(selected)}
                  disabled={narrativeLoading}
                  style={{
                    padding: '6px 14px',
                    background: narrativeLoading ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: narrativeLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Sparkles size={12} />
                  {narrativeLoading ? 'Generating...' : narrative ? 'Regenerate' : 'Generate'}
                </button>
              </div>

              {narrativeError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 10, fontSize: 12, color: '#dc2626' }}>
                  {narrativeError}
                </div>
              )}

              {narrativeLoading && (
                <div style={{ background: '#f5f3ff', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 500 }}>Analyzing risk factors...</div>
                  <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 4 }}>Generating underwriting narrative</div>
                </div>
              )}

              {narrative && !narrativeLoading && (
                <div style={{ background: '#f5f3ff', borderRadius: 8, padding: 14, display: 'grid', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Summary</div>
                    <p style={{ fontSize: 13, color: '#1e1b4b', margin: 0, lineHeight: 1.5 }}>{narrative.summary}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Key Drivers</div>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {narrative.keyDrivers.map((driver, i) => (
                        <li key={i} style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{driver}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Recommendation</div>
                    <p style={{ fontSize: 13, color: '#1e1b4b', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{narrative.recommendation}</p>
                  </div>
                  <div style={{ fontSize: 10, color: '#a78bfa', textAlign: 'right' }}>
                    Generated by {narrative.generatedBy === 'ai' ? 'AI model' : 'rules engine'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
