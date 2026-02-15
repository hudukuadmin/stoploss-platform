import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { UnderwritingReview } from '../types';
import { UnderwritingDecision } from '../types';
import { underwritingApi } from '../api/services';

export default function UnderwritingPage() {
  const [reviews, setReviews] = useState<UnderwritingReview[]>([]);
  const [selected, setSelected] = useState<UnderwritingReview | null>(null);

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

  const formatCurrency = (val: number | undefined) =>
    val != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val) : '-';

  const btnStyle = (bg: string) => ({
    padding: '6px 14px', background: bg, color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 12, fontWeight: 600 as const, cursor: 'pointer',
  });

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
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
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === review.id ? '#eff6ff' : 'transparent' }}
                    onClick={() => setSelected(review)}
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
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
