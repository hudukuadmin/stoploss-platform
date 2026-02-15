import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { ClipboardList, DollarSign, Clock, CheckCircle } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

type ClaimStatus = 'all' | 'submitted' | 'accepted' | 'denied' | 'in_review' | 'paid';

const claims = [
  { id: 'CLM-2026-0001', memberId: 'M-10045', memberName: 'Robert Chen', planSponsor: 'Pacific Health ACO', policyId: 'BSP-2026-0001', serviceDate: '2025-12-15', submittedDate: '2026-01-05', claimAmount: 285000, paidAmount: 285000, status: 'paid' as const, claimType: 'Specific', diagnosisCode: 'C34.1', provider: 'Memorial Hospital', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0002', memberId: 'M-10112', memberName: 'Maria Santos', planSponsor: 'Pacific Health ACO', policyId: 'BSP-2026-0001', serviceDate: '2025-12-20', submittedDate: '2026-01-08', claimAmount: 420000, paidAmount: 420000, status: 'paid' as const, claimType: 'Specific', diagnosisCode: 'I25.10', provider: 'Pacific Medical Center', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0003', memberId: 'M-20034', memberName: 'James Wilson', planSponsor: 'Midwest Provider Network', policyId: 'BSP-2026-0002', serviceDate: '2026-01-03', submittedDate: '2026-01-18', claimAmount: 195000, paidAmount: 0, status: 'in_review' as const, claimType: 'Specific', diagnosisCode: 'M54.5', provider: 'Midwest Spine Center', reinsurer: 'Swiss Re' },
  { id: 'CLM-2026-0004', memberId: 'M-30089', memberName: 'Patricia Lee', planSponsor: 'Southeast TPA Solutions', policyId: 'BSP-2026-0003', serviceDate: '2025-11-28', submittedDate: '2025-12-15', claimAmount: 680000, paidAmount: 645000, status: 'paid' as const, claimType: 'Specific', diagnosisCode: 'C50.9', provider: 'Southeast Cancer Center', reinsurer: 'Munich Re' },
  { id: 'CLM-2026-0005', memberId: 'M-10078', memberName: 'David Kim', planSponsor: 'Pacific Health ACO', policyId: 'BSP-2026-0001', serviceDate: '2026-01-10', submittedDate: '2026-01-25', claimAmount: 312000, paidAmount: 0, status: 'submitted' as const, claimType: 'Specific', diagnosisCode: 'E11.65', provider: 'Pacific Dialysis Center', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0006', memberId: 'M-40015', memberName: 'Susan Martinez', planSponsor: 'Northeast ACO Partners', policyId: 'BSP-2026-0004', serviceDate: '2026-01-15', submittedDate: '2026-02-01', claimAmount: 248000, paidAmount: 0, status: 'submitted' as const, claimType: 'Specific', diagnosisCode: 'N18.6', provider: 'Northeast Renal Center', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0007', memberId: 'M-20056', memberName: 'Thomas Brown', planSponsor: 'Midwest Provider Network', policyId: 'BSP-2026-0002', serviceDate: '2025-12-08', submittedDate: '2025-12-22', claimAmount: 155000, paidAmount: 0, status: 'denied' as const, claimType: 'Specific', diagnosisCode: 'S72.001A', provider: 'Midwest Orthopedic', reinsurer: 'Swiss Re' },
  { id: 'CLM-2026-0008', memberId: 'M-30102', memberName: 'Angela Davis', planSponsor: 'Southeast TPA Solutions', policyId: 'BSP-2026-0003', serviceDate: '2026-01-20', submittedDate: '2026-02-05', claimAmount: 520000, paidAmount: 0, status: 'in_review' as const, claimType: 'Specific', diagnosisCode: 'G35', provider: 'Southeast Neurology', reinsurer: 'Munich Re' },
  { id: 'CLM-2026-0009', memberId: 'M-50008', memberName: 'Richard Taylor', planSponsor: 'Gulf Coast Health Group', policyId: 'BSP-2025-0005', serviceDate: '2025-12-28', submittedDate: '2026-01-12', claimAmount: 178000, paidAmount: 178000, status: 'paid' as const, claimType: 'Specific', diagnosisCode: 'J96.01', provider: 'Gulf Coast Pulmonary', reinsurer: 'Swiss Re' },
  { id: 'CLM-2026-0010', memberId: 'M-10092', memberName: 'Jennifer White', planSponsor: 'Pacific Health ACO', policyId: 'BSP-2026-0001', serviceDate: '2026-02-01', submittedDate: '2026-02-10', claimAmount: 395000, paidAmount: 0, status: 'submitted' as const, claimType: 'Specific', diagnosisCode: 'C18.9', provider: 'Pacific Oncology', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0011', memberId: 'M-40028', memberName: 'Michael Johnson', planSponsor: 'Northeast ACO Partners', policyId: 'BSP-2026-0004', serviceDate: '2025-11-15', submittedDate: '2025-12-01', claimAmount: 290000, paidAmount: 290000, status: 'paid' as const, claimType: 'Specific', diagnosisCode: 'I63.9', provider: 'Northeast Stroke Center', reinsurer: 'Aon Re' },
  { id: 'CLM-2026-0012', memberId: 'M-30045', memberName: 'Linda Garcia', planSponsor: 'Southeast TPA Solutions', policyId: 'BSP-2026-0003', serviceDate: '2026-01-25', submittedDate: '2026-02-08', claimAmount: 445000, paidAmount: 0, status: 'accepted' as const, claimType: 'Specific', diagnosisCode: 'K70.31', provider: 'Southeast Transplant', reinsurer: 'Munich Re' },
];

const monthlyClaimVolume = [
  { month: 'Sep 2025', count: 8, amount: 2150000 },
  { month: 'Oct 2025', count: 10, amount: 2680000 },
  { month: 'Nov 2025', count: 9, amount: 2420000 },
  { month: 'Dec 2025', count: 12, amount: 3150000 },
  { month: 'Jan 2026', count: 14, amount: 3520000 },
  { month: 'Feb 2026', count: 8, amount: 2240000 },
];

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  submitted: { bg: '#e0f2fe', color: '#075985', label: 'SUBMITTED' },
  accepted: { bg: '#e8d5f5', color: '#452d5a', label: 'ACCEPTED' },
  in_review: { bg: '#fef3c7', color: '#92400e', label: 'IN REVIEW' },
  paid: { bg: '#dcfce7', color: '#166534', label: 'PAID' },
  denied: { bg: '#fee2e2', color: '#991b1b', label: 'DENIED' },
};

export default function ClaimsRepositoryPage() {
  const [filter, setFilter] = useState<ClaimStatus>('all');
  const [selectedClaim, setSelectedClaim] = useState<typeof claims[0] | null>(null);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);
  const totalSubmitted = claims.reduce((s, c) => s + c.claimAmount, 0);
  const totalPaid = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.paidAmount, 0);
  const pendingCount = claims.filter(c => ['submitted', 'in_review', 'accepted'].includes(c.status)).length;

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Claims Repository
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Manage all submitted reinsurance claims. Track claim status from submission through payment, with full drill-down into member and clinical details.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Claims" value={claims.length} icon={<ClipboardList size={22} />} trend="All time" />
        <MetricCard label="Total Submitted" value={formatCurrency(totalSubmitted)} icon={<DollarSign size={22} />} trend="Aggregate claim value" />
        <MetricCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<CheckCircle size={22} />} trend={`${claims.filter(c => c.status === 'paid').length} claims settled`} />
        <MetricCard label="Pending Review" value={pendingCount} icon={<Clock size={22} />} trend="Awaiting action" />
      </div>

      <Card title="Monthly Claim Volume" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyClaimVolume}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
            <Bar dataKey="amount" fill="#6f4891" name="Claim Amount" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="All Claims">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'submitted', 'accepted', 'in_review', 'paid', 'denied'] as ClaimStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '5px 14px', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer',
                background: filter === s ? '#6f4891' : '#f1f5f9',
                color: filter === s ? '#fff' : '#64748b',
              }}
            >
              {s === 'all' ? 'All' : s === 'in_review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? claims.length : claims.filter(c => c.status === s).length})
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Claim ID', 'Member', 'Plan Sponsor', 'Service Date', 'Submitted', 'Claim Amount', 'Paid', 'Type', 'Reinsurer', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = statusColors[c.status];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedClaim(selectedClaim?.id === c.id ? null : c)}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedClaim?.id === c.id ? '#f8fafc' : 'transparent' }}
                  >
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#452d5a' }}>{c.id}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{c.memberName}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{c.planSponsor}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{c.serviceDate}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{c.submittedDate}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{formatCurrency(c.claimAmount)}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{c.paidAmount > 0 ? formatCurrency(c.paidAmount) : '-'}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{c.claimType}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{c.reinsurer}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedClaim && (
          <div style={{ marginTop: 16, padding: 20, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#452d5a' }}>Claim Detail: {selectedClaim.id}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Member Info</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#452d5a' }}>{selectedClaim.memberName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>ID: {selectedClaim.memberId}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Plan Sponsor: {selectedClaim.planSponsor}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Clinical</div>
                <div style={{ fontSize: 13, color: '#334155' }}>Diagnosis: {selectedClaim.diagnosisCode}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Provider: {selectedClaim.provider}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Service Date: {selectedClaim.serviceDate}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Financial</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Claim: {formatCurrency(selectedClaim.claimAmount)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Paid: {selectedClaim.paidAmount > 0 ? formatCurrency(selectedClaim.paidAmount) : 'Pending'}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Reinsurer: {selectedClaim.reinsurer} | Policy: {selectedClaim.policyId}</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div style={{ marginTop: 16, padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
        <span>Showing {filtered.length} of {claims.length} claims</span>
        <span>Total Value: {formatCurrency(filtered.reduce((s, c) => s + c.claimAmount, 0))}</span>
      </div>
    </div>
  );
}
