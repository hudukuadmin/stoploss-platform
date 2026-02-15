import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6f4891'];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

type ReconciliationStatus = 'all' | 'reconciled' | 'pending' | 'disputed' | 'in_review';

const reconciliationRecords = [
  { id: 'REC-2026-001', policyId: 'BSP-2026-0001', planSponsor: 'Pacific Health ACO', period: 'Jan 2026', claimsSubmitted: 680000, claimsPaid: 652000, variance: 28000, status: 'reconciled' as const, reconciledDate: '2026-02-01', reinsurer: 'Aon Re' },
  { id: 'REC-2026-002', policyId: 'BSP-2026-0002', planSponsor: 'Midwest Provider Network', period: 'Jan 2026', claimsSubmitted: 420000, claimsPaid: 398000, variance: 22000, status: 'reconciled' as const, reconciledDate: '2026-02-03', reinsurer: 'Swiss Re' },
  { id: 'REC-2026-003', policyId: 'BSP-2026-0001', planSponsor: 'Pacific Health ACO', period: 'Feb 2026', claimsSubmitted: 720000, claimsPaid: 0, variance: 720000, status: 'pending' as const, reconciledDate: null, reinsurer: 'Aon Re' },
  { id: 'REC-2026-004', policyId: 'BSP-2026-0003', planSponsor: 'Southeast TPA Solutions', period: 'Jan 2026', claimsSubmitted: 890000, claimsPaid: 845000, variance: 45000, status: 'disputed' as const, reconciledDate: null, reinsurer: 'Munich Re' },
  { id: 'REC-2026-005', policyId: 'BSP-2026-0003', planSponsor: 'Southeast TPA Solutions', period: 'Dec 2025', claimsSubmitted: 850000, claimsPaid: 832000, variance: 18000, status: 'reconciled' as const, reconciledDate: '2026-01-15', reinsurer: 'Munich Re' },
  { id: 'REC-2026-006', policyId: 'BSP-2026-0002', planSponsor: 'Midwest Provider Network', period: 'Feb 2026', claimsSubmitted: 445000, claimsPaid: 0, variance: 445000, status: 'pending' as const, reconciledDate: null, reinsurer: 'Swiss Re' },
  { id: 'REC-2026-007', policyId: 'BSP-2026-0004', planSponsor: 'Northeast ACO Partners', period: 'Jan 2026', claimsSubmitted: 520000, claimsPaid: 505000, variance: 15000, status: 'in_review' as const, reconciledDate: null, reinsurer: 'Aon Re' },
  { id: 'REC-2026-008', policyId: 'BSP-2026-0004', planSponsor: 'Northeast ACO Partners', period: 'Dec 2025', claimsSubmitted: 498000, claimsPaid: 490000, variance: 8000, status: 'reconciled' as const, reconciledDate: '2026-01-10', reinsurer: 'Aon Re' },
  { id: 'REC-2026-009', policyId: 'BSP-2025-0005', planSponsor: 'Gulf Coast Health Group', period: 'Jan 2026', claimsSubmitted: 310000, claimsPaid: 295000, variance: 15000, status: 'in_review' as const, reconciledDate: null, reinsurer: 'Swiss Re' },
  { id: 'REC-2026-010', policyId: 'BSP-2025-0005', planSponsor: 'Gulf Coast Health Group', period: 'Dec 2025', claimsSubmitted: 285000, claimsPaid: 278000, variance: 7000, status: 'reconciled' as const, reconciledDate: '2026-01-08', reinsurer: 'Swiss Re' },
];

const monthlyReconciliation = [
  { month: 'Sep 2025', submitted: 2850000, paid: 2720000, variance: 130000 },
  { month: 'Oct 2025', submitted: 2920000, paid: 2810000, variance: 110000 },
  { month: 'Nov 2025', submitted: 2980000, paid: 2860000, variance: 120000 },
  { month: 'Dec 2025', submitted: 3050000, paid: 2940000, variance: 110000 },
  { month: 'Jan 2026', submitted: 3120000, paid: 2950000, variance: 170000 },
  { month: 'Feb 2026', submitted: 3180000, paid: 0, variance: 3180000 },
];

const statusBreakdown = [
  { name: 'Reconciled', value: 4 },
  { name: 'Pending', value: 2 },
  { name: 'Disputed', value: 1 },
  { name: 'In Review', value: 2 },
];

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  reconciled: { bg: '#dcfce7', color: '#166534', label: 'RECONCILED' },
  pending: { bg: '#fef3c7', color: '#92400e', label: 'PENDING' },
  disputed: { bg: '#fee2e2', color: '#991b1b', label: 'DISPUTED' },
  in_review: { bg: '#e8d5f5', color: '#452d5a', label: 'IN REVIEW' },
};

export default function ReconciliationPage() {
  const [filter, setFilter] = useState<ReconciliationStatus>('all');

  const filtered = filter === 'all' ? reconciliationRecords : reconciliationRecords.filter(r => r.status === filter);
  const totalSubmitted = reconciliationRecords.reduce((s, r) => s + r.claimsSubmitted, 0);
  const totalPaid = reconciliationRecords.reduce((s, r) => s + r.claimsPaid, 0);
  const totalVariance = reconciliationRecords.reduce((s, r) => s + r.variance, 0);
  const reconciledCount = reconciliationRecords.filter(r => r.status === 'reconciled').length;

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Reconciliation Status
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Track claims reconciliation across all policies, reinsurers, and periods. Monitor variances, disputed items, and settlement progress.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Submitted" value={formatCurrency(totalSubmitted)} icon={<RefreshCw size={22} />} trend={`${reconciliationRecords.length} records`} />
        <MetricCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<CheckCircle size={22} />} trend="Across all periods" />
        <MetricCard label="Outstanding Variance" value={formatCurrency(totalVariance)} icon={<AlertTriangle size={22} />} trend="Requires resolution" />
        <MetricCard label="Reconciliation Rate" value={`${((reconciledCount / reconciliationRecords.length) * 100).toFixed(0)}%`} icon={<Clock size={22} />} trend={`${reconciledCount} of ${reconciliationRecords.length} settled`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Monthly Claims Submitted vs Paid">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyReconciliation.filter(m => m.paid > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="submitted" fill="#6f4891" name="Submitted" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paid" fill="#0d9488" name="Paid" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Status Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={3} dataKey="value">
                {statusBreakdown.map((_e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Reconciliation Records">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'reconciled', 'pending', 'disputed', 'in_review'] as ReconciliationStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '5px 14px', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer',
                background: filter === s ? '#6f4891' : '#f1f5f9',
                color: filter === s ? '#fff' : '#64748b',
              }}
            >
              {s === 'all' ? 'All' : s === 'in_review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? reconciliationRecords.length : reconciliationRecords.filter(r => r.status === s).length})
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Rec ID', 'Policy', 'Plan Sponsor', 'Period', 'Reinsurer', 'Submitted', 'Paid', 'Variance', 'Status', 'Settled'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const sc = statusColors[r.status];
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#452d5a' }}>{r.id}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{r.policyId}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{r.planSponsor}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{r.period}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>{r.reinsurer}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{formatCurrency(r.claimsSubmitted)}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600 }}>{r.claimsPaid > 0 ? formatCurrency(r.claimsPaid) : '-'}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: r.status === 'disputed' ? '#991b1b' : '#64748b' }}>{formatCurrency(r.variance)}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '8px 10px', fontSize: 12, color: '#64748b' }}>{r.reconciledDate ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
