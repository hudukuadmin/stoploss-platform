import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { Policy } from '../types';
import { policiesApi } from '../api/services';

const formatCurrency = (val: number | undefined) =>
  val != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    : '-';

const mockPolicies: Policy[] = [
  {
    id: 'p-1',
    policyNumber: 'BSP-2026-0001',
    groupId: '1',
    group: { id: '1', name: 'Pacific Health ACO', groupType: 'aco' as any, contractType: 'shared_risk' as any, memberCount: 4500, createdAt: '2026-01-15', updatedAt: '2026-01-15' },
    quoteId: '4',
    coverageType: 'both' as any,
    status: 'active' as any,
    effectiveDate: '2026-01-01',
    terminationDate: '2026-12-31',
    specificAttachmentPoint: 300000,
    specificMaxLiability: 1500000,
    aggregateAttachmentPoint: 4200000,
    aggregateAttachmentFactor: 1.30,
    aggregateMaxLiability: 2000000,
    totalAnnualPremium: 315000,
    pepmRate: 345.60,
    boundBy: 'Dr. Sarah Chen',
    boundAt: '2025-12-15T10:00:00Z',
    createdAt: '2025-12-15T10:00:00Z',
  },
  {
    id: 'p-2',
    policyNumber: 'BSP-2026-0002',
    groupId: '3',
    group: { id: '3', name: 'Southeast TPA Solutions', groupType: 'tpa' as any, contractType: 'shared_savings' as any, memberCount: 8100, createdAt: '2025-12-20', updatedAt: '2025-12-20' },
    quoteId: '3',
    coverageType: 'aggregate' as any,
    status: 'active' as any,
    effectiveDate: '2026-02-01',
    terminationDate: '2027-01-31',
    aggregateAttachmentPoint: 5600000,
    aggregateAttachmentFactor: 1.20,
    aggregateMaxLiability: 2800000,
    totalAnnualPremium: 218000,
    pepmRate: 268.40,
    boundBy: 'James Mitchell',
    boundAt: '2026-01-28T14:30:00Z',
    createdAt: '2026-01-28T14:30:00Z',
  },
  {
    id: 'p-3',
    policyNumber: 'BSP-2025-0008',
    groupId: '2',
    group: { id: '2', name: 'Midwest Provider Network', groupType: 'provider_group' as any, contractType: 'full_risk' as any, memberCount: 2200, createdAt: '2026-01-10', updatedAt: '2026-01-10' },
    quoteId: '7',
    coverageType: 'specific' as any,
    status: 'expired' as any,
    effectiveDate: '2025-01-01',
    terminationDate: '2025-12-31',
    specificAttachmentPoint: 200000,
    specificMaxLiability: 1000000,
    totalAnnualPremium: 84000,
    pepmRate: 218.90,
    boundBy: 'Dr. Sarah Chen',
    boundAt: '2024-12-10T09:00:00Z',
    createdAt: '2024-12-10T09:00:00Z',
  },
  {
    id: 'p-4',
    policyNumber: 'BSP-2026-0003',
    groupId: '1',
    group: { id: '1', name: 'Pacific Health ACO', groupType: 'aco' as any, contractType: 'shared_risk' as any, memberCount: 4500, createdAt: '2026-01-15', updatedAt: '2026-01-15' },
    quoteId: '1',
    coverageType: 'both' as any,
    status: 'pending' as any,
    effectiveDate: '2026-03-01',
    terminationDate: '2027-02-28',
    specificAttachmentPoint: 250000,
    specificMaxLiability: 1250000,
    aggregateAttachmentPoint: 3800000,
    aggregateAttachmentFactor: 1.25,
    aggregateMaxLiability: 1900000,
    totalAnnualPremium: 267000,
    pepmRate: 310.25,
    boundBy: 'James Mitchell',
    boundAt: '2026-02-05T16:00:00Z',
    createdAt: '2026-02-05T16:00:00Z',
  },
  {
    id: 'p-5',
    policyNumber: 'BSP-2025-0005',
    groupId: '3',
    group: { id: '3', name: 'Southeast TPA Solutions', groupType: 'tpa' as any, contractType: 'shared_savings' as any, memberCount: 8100, createdAt: '2025-12-20', updatedAt: '2025-12-20' },
    quoteId: '8',
    coverageType: 'both' as any,
    status: 'cancelled' as any,
    effectiveDate: '2025-06-01',
    terminationDate: '2026-05-31',
    specificAttachmentPoint: 275000,
    specificMaxLiability: 1375000,
    aggregateAttachmentPoint: 5000000,
    aggregateAttachmentFactor: 1.18,
    aggregateMaxLiability: 2500000,
    totalAnnualPremium: 295000,
    pepmRate: 302.15,
    boundBy: 'Dr. Sarah Chen',
    boundAt: '2025-05-20T11:00:00Z',
    createdAt: '2025-05-20T11:00:00Z',
  },
];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [selected, setSelected] = useState<Policy | null>(null);

  useEffect(() => {
    policiesApi.list().then(setPolicies).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>Policies</h2>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <Card>
          {policies.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
              No policies yet. Bind an approved quote to create a policy for a plan sponsor.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  {['Policy #', 'Plan Sponsor', 'Coverage', 'Status', 'Premium', 'PEPM', 'Effective'].map((h) => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr
                    key={policy.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === policy.id ? '#f6f1f9' : 'transparent' }}
                    onClick={() => setSelected(policy)}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 600, fontSize: 13, color: '#6f4891' }}>{policy.policyNumber}</td>
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
