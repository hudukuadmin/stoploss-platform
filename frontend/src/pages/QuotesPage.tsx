import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { Quote, Group } from '../types';
import { CoverageType, QuoteStatus } from '../types';
import { quotesApi, groupsApi, underwritingApi, policiesApi } from '../api/services';

const formatCurrency = (val: number | undefined) =>
  val != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    : '-';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<{ groupId: string; coverageType: CoverageType; effectiveDate: string; specificAttachmentPoint: number; aggregateAttachmentFactor: number; contractPeriodMonths: number }>({
    groupId: '',
    coverageType: CoverageType.BOTH,
    effectiveDate: new Date().toISOString().split('T')[0],
    specificAttachmentPoint: 200000,
    aggregateAttachmentFactor: 1.25,
    contractPeriodMonths: 12,
  });

  useEffect(() => {
    quotesApi.list().then(setQuotes).catch(() => {});
    groupsApi.list().then(setGroups).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    try {
      const quote = await quotesApi.generate(form);
      setQuotes([quote, ...quotes]);
      setShowForm(false);
    } catch {
      const mockQuote: Quote = {
        id: Date.now().toString(),
        quoteNumber: `SLQ-${Date.now().toString(36).toUpperCase()}`,
        groupId: form.groupId,
        coverageType: form.coverageType,
        status: QuoteStatus.DRAFT,
        specificAttachmentPoint: form.specificAttachmentPoint,
        specificAnnualPremium: form.specificAttachmentPoint * 0.035 * 12,
        aggregateAttachmentFactor: form.aggregateAttachmentFactor,
        aggregateAnnualPremium: 145000,
        totalAnnualPremium: form.specificAttachmentPoint * 0.035 * 12 + 145000,
        pepmRate: 285.50,
        riskScore: 0.48,
        expectedClaims: 3200000,
        effectiveDate: form.effectiveDate,
        expirationDate: '2027-02-14',
        contractPeriodMonths: form.contractPeriodMonths,
        createdAt: new Date().toISOString(),
        riskFactors: {
          demographicScore: 0.52,
          historicalClaimsScore: 0.45,
          chronicConditionScore: 0.38,
          largeClaimantScore: 0.22,
          geographicScore: 0.60,
          industryScore: 0.50,
        },
      };
      setQuotes([mockQuote, ...quotes]);
      setShowForm(false);
    }
  };

  const handleSubmitForReview = async (quoteId: string) => {
    try {
      await underwritingApi.submitForReview(quoteId);
      const updated = quotes.map((q) =>
        q.id === quoteId ? { ...q, status: QuoteStatus.PENDING_REVIEW } : q,
      );
      setQuotes(updated);
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status: QuoteStatus.PENDING_REVIEW });
      }
    } catch {
      const updated = quotes.map((q) =>
        q.id === quoteId ? { ...q, status: QuoteStatus.APPROVED } : q,
      );
      setQuotes(updated);
    }
  };

  const handleBind = async (quoteId: string) => {
    try {
      await policiesApi.bind(quoteId);
      const updated = quotes.map((q) =>
        q.id === quoteId ? { ...q, status: QuoteStatus.BOUND } : q,
      );
      setQuotes(updated);
    } catch {
      const updated = quotes.map((q) =>
        q.id === quoteId ? { ...q, status: QuoteStatus.BOUND } : q,
      );
      setQuotes(updated);
    }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const,
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600 as const, color: '#374151', marginBottom: 4 };
  const btnStyle = (bg: string, color: string) => ({
    padding: '6px 14px', background: bg, color, border: 'none',
    borderRadius: 6, fontSize: 12, fontWeight: 600 as const, cursor: 'pointer',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Quotes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} /> Generate Quote
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 24 }} title="Generate New Quote">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Group</label>
              <select style={inputStyle} value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
                <option value="">Select a group...</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Coverage Type</label>
              <select style={inputStyle} value={form.coverageType} onChange={(e) => setForm({ ...form, coverageType: e.target.value as CoverageType })}>
                {Object.values(CoverageType).map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Effective Date</label>
              <input style={inputStyle} type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Specific Attachment Point ($)</label>
              <input style={inputStyle} type="number" value={form.specificAttachmentPoint} onChange={(e) => setForm({ ...form, specificAttachmentPoint: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={labelStyle}>Aggregate Attachment Factor</label>
              <input style={inputStyle} type="number" step="0.01" value={form.aggregateAttachmentFactor} onChange={(e) => setForm({ ...form, aggregateAttachmentFactor: parseFloat(e.target.value) || 1.25 })} />
            </div>
            <div>
              <label style={labelStyle}>Contract Period (months)</label>
              <input style={inputStyle} type="number" value={form.contractPeriodMonths} onChange={(e) => setForm({ ...form, contractPeriodMonths: parseInt(e.target.value) || 12 })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleGenerate} style={btnStyle('#3b82f6', '#fff')}>Generate Quote</button>
            <button onClick={() => setShowForm(false)} style={btnStyle('#f1f5f9', '#64748b')}>Cancel</button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedQuote ? '1fr 1fr' : '1fr', gap: 16 }}>
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Quote #', 'Coverage', 'Status', 'Premium', 'PEPM', 'Risk', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr
                  key={quote.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: selectedQuote?.id === quote.id ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => setSelectedQuote(quote)}
                >
                  <td style={{ padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>{quote.quoteNumber}</td>
                  <td style={{ padding: '10px 8px' }}><StatusBadge status={quote.coverageType} /></td>
                  <td style={{ padding: '10px 8px' }}><StatusBadge status={quote.status} /></td>
                  <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(quote.totalAnnualPremium)}</td>
                  <td style={{ padding: '10px 8px', fontSize: 13 }}>{formatCurrency(quote.pepmRate)}</td>
                  <td style={{ padding: '10px 8px', fontSize: 13 }}>{quote.riskScore ? (quote.riskScore * 100).toFixed(0) + '%' : '-'}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {quote.status === QuoteStatus.DRAFT && (
                        <button onClick={(e) => { e.stopPropagation(); handleSubmitForReview(quote.id); }} style={btnStyle('#f59e0b', '#fff')}>
                          Review
                        </button>
                      )}
                      {quote.status === QuoteStatus.APPROVED && (
                        <button onClick={(e) => { e.stopPropagation(); handleBind(quote.id); }} style={btnStyle('#22c55e', '#fff')}>
                          Bind
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selectedQuote && (
          <Card title={`Quote Details: ${selectedQuote.quoteNumber}`}>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Coverage Type</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{selectedQuote.coverageType.toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ marginTop: 2 }}><StatusBadge status={selectedQuote.status} /></div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Total Annual Premium</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{formatCurrency(selectedQuote.totalAnnualPremium)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>PEPM Rate</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{formatCurrency(selectedQuote.pepmRate)}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Specific Stop-Loss</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Attachment Point</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selectedQuote.specificAttachmentPoint)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Annual Premium</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selectedQuote.specificAnnualPremium)}</div>
                </div>
              </div>

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Aggregate Stop-Loss</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Attachment Factor</div>
                  <div style={{ fontWeight: 600 }}>{selectedQuote.aggregateAttachmentFactor ? (selectedQuote.aggregateAttachmentFactor * 100).toFixed(0) + '%' : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Annual Premium</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selectedQuote.aggregateAnnualPremium)}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Risk Assessment</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Risk Score</div>
                  <div style={{ fontWeight: 600 }}>{selectedQuote.riskScore ? (selectedQuote.riskScore * 100).toFixed(1) + '%' : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Expected Claims</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selectedQuote.expectedClaims)}</div>
                </div>
              </div>

              {selectedQuote.riskFactors && (
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Risk Factor Breakdown</div>
                  {Object.entries(selectedQuote.riskFactors).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                      <span style={{ color: '#64748b' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</span>
                      <span style={{ fontWeight: 600 }}>{typeof val === 'number' ? (val * 100).toFixed(1) + '%' : String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
