import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { Policy } from '../types';
import { policiesApi } from '../api/services';

const formatCurrency = (val: number | undefined) =>
  val != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    : '-';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selected, setSelected] = useState<Policy | null>(null);

  useEffect(() => {
    policiesApi.list().then(setPolicies).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Policies</h2>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <Card>
          {policies.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
              No policies yet. Bind an approved quote to create a policy.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  {['Policy #', 'Group', 'Coverage', 'Status', 'Premium', 'PEPM', 'Effective'].map((h) => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr
                    key={policy.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === policy.id ? '#eff6ff' : 'transparent' }}
                    onClick={() => setSelected(policy)}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 600, fontSize: 13, color: '#3b82f6' }}>{policy.policyNumber}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{policy.group?.name || '-'}</td>
                    <td style={{ padding: '10px 8px' }}><StatusBadge status={policy.coverageType} /></td>
                    <td style={{ padding: '10px 8px' }}><StatusBadge status={policy.status} /></td>
                    <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(policy.totalAnnualPremium)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{formatCurrency(policy.pepmRate)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{new Date(policy.effectiveDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {selected && (
          <Card title={`Policy: ${selected.policyNumber}`}>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Status</div>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Coverage</div>
                  <StatusBadge status={selected.coverageType} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Total Premium</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(selected.totalAnnualPremium)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>PEPM Rate</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(selected.pepmRate)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Effective Date</div>
                  <div style={{ fontWeight: 600 }}>{new Date(selected.effectiveDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Termination Date</div>
                  <div style={{ fontWeight: 600 }}>{new Date(selected.terminationDate).toLocaleDateString()}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Specific Stop-Loss</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Attachment Point</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selected.specificAttachmentPoint)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Max Liability</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selected.specificMaxLiability)}</div>
                </div>
              </div>

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Aggregate Stop-Loss</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Attachment Point</div>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(selected.aggregateAttachmentPoint)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Attachment Factor</div>
                  <div style={{ fontWeight: 600 }}>{selected.aggregateAttachmentFactor ? (selected.aggregateAttachmentFactor * 100).toFixed(0) + '%' : '-'}</div>
                </div>
              </div>

              {selected.boundBy && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Bound by {selected.boundBy} on {selected.boundAt ? new Date(selected.boundAt).toLocaleDateString() : '-'}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
