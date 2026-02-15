import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
  AreaChart, Area,
} from 'recharts';
import Card from '../../components/common/Card';
import MetricCard from '../../components/common/MetricCard';
import { FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';

const COLORS = { purple: '#6f4891', teal: '#0d9488', light: '#8d5ead', amber: '#f59e0b' };

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const monthlyFinancials = [
  { month: 'Sep 2025', revenue: 2850000, claimsPaid: 2120000, adminCosts: 285000, netIncome: 445000 },
  { month: 'Oct 2025', revenue: 2920000, claimsPaid: 2280000, adminCosts: 292000, netIncome: 348000 },
  { month: 'Nov 2025', revenue: 2980000, claimsPaid: 2150000, adminCosts: 298000, netIncome: 532000 },
  { month: 'Dec 2025', revenue: 3050000, claimsPaid: 2480000, adminCosts: 305000, netIncome: 265000 },
  { month: 'Jan 2026', revenue: 3120000, claimsPaid: 2350000, adminCosts: 312000, netIncome: 458000 },
  { month: 'Feb 2026', revenue: 3180000, claimsPaid: 2290000, adminCosts: 318000, netIncome: 572000 },
];

const claimsAging = [
  { bucket: '0-30 days', count: 342, amount: 4850000 },
  { bucket: '31-60 days', count: 128, amount: 2150000 },
  { bucket: '61-90 days', count: 45, amount: 980000 },
  { bucket: '91-120 days', count: 18, amount: 520000 },
  { bucket: '120+ days', count: 8, amount: 380000 },
];

const utilizationTrend = [
  { month: 'Sep 2025', inpatient: 42, outpatient: 1850, er: 185, primaryCare: 3200 },
  { month: 'Oct 2025', inpatient: 38, outpatient: 1920, er: 172, primaryCare: 3350 },
  { month: 'Nov 2025', inpatient: 45, outpatient: 1780, er: 195, primaryCare: 3100 },
  { month: 'Dec 2025', inpatient: 52, outpatient: 1650, er: 218, primaryCare: 2980 },
  { month: 'Jan 2026', inpatient: 48, outpatient: 1890, er: 192, primaryCare: 3280 },
  { month: 'Feb 2026', inpatient: 40, outpatient: 1950, er: 168, primaryCare: 3420 },
];

const payerMix = [
  { payer: 'Medicare Advantage', members: 3800, revenue: 8200000, pepm: 358.77, margin: 4.2 },
  { payer: 'Commercial HMO', members: 4200, revenue: 6850000, pepm: 271.03, margin: 6.8 },
  { payer: 'Commercial PPO', members: 2800, revenue: 5100000, pepm: 303.57, margin: 5.1 },
  { payer: 'Medicaid', members: 2100, revenue: 2950000, pepm: 233.73, margin: 1.8 },
  { payer: 'Medicare FFS', members: 1900, revenue: 4200000, pepm: 368.42, margin: 3.5 },
];

const regulatoryReports = [
  { name: 'CMS Quality Reporting (MIPS)', dueDate: '03/31/2026', status: 'in_progress', completion: 72 },
  { name: 'HEDIS Measure Submission', dueDate: '06/15/2026', status: 'not_started', completion: 0 },
  { name: 'Risk Adjustment Data Validation', dueDate: '04/30/2026', status: 'in_progress', completion: 45 },
  { name: 'Annual Financial Reconciliation', dueDate: '03/15/2026', status: 'in_progress', completion: 88 },
  { name: 'State DOI Filing', dueDate: '05/01/2026', status: 'not_started', completion: 0 },
  { name: 'MLR Reporting (80/20 Rule)', dueDate: '06/01/2026', status: 'not_started', completion: 0 },
];

const reinsuranceRecoveries = [
  { month: 'Sep 2025', submitted: 680000, recovered: 612000 },
  { month: 'Oct 2025', submitted: 750000, recovered: 690000 },
  { month: 'Nov 2025', submitted: 520000, recovered: 475000 },
  { month: 'Dec 2025', submitted: 890000, recovered: 810000 },
  { month: 'Jan 2026', submitted: 720000, recovered: 648000 },
  { month: 'Feb 2026', submitted: 830000, recovered: 755000 },
];

export default function ReportingAnalyticsPage() {
  const totalRevenue = monthlyFinancials.reduce((s, m) => s + m.revenue, 0);
  const totalClaims = monthlyFinancials.reduce((s, m) => s + m.claimsPaid, 0);
  const mlr = ((totalClaims / totalRevenue) * 100).toFixed(1);
  const totalRecovered = reinsuranceRecoveries.reduce((s, m) => s + m.recovered, 0);
  const agingTotal = claimsAging.reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Reporting Analytics
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Financial reporting, claims aging, utilization metrics, payer mix analysis, regulatory compliance tracking, and reinsurance recovery monitoring.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="6-Month Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign size={22} />} trend="Sep 2025 - Feb 2026" />
        <MetricCard label="Medical Loss Ratio" value={`${mlr}%`} icon={<FileText size={22} />} trend="Target: < 85%" />
        <MetricCard label="Reinsurance Recovered" value={formatCurrency(totalRecovered)} icon={<AlertTriangle size={22} />} trend="6-month total" />
        <MetricCard label="Claims Aging > 90 days" value={formatCurrency(claimsAging.filter(b => b.bucket.includes('91') || b.bucket.includes('120')).reduce((s, b) => s + b.amount, 0))} icon={<Clock size={22} />} trend={`${claimsAging.filter(b => b.bucket.includes('91') || b.bucket.includes('120')).reduce((s, b) => s + b.count, 0)} claims`} />
      </div>

      <Card title="Monthly Financial Summary" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyFinancials}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
            <Legend />
            <Bar dataKey="revenue" fill={COLORS.purple} name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="claimsPaid" fill={COLORS.light} name="Claims Paid" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netIncome" fill={COLORS.teal} name="Net Income" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Claims Aging Report">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Aging Bucket', 'Claims Count', 'Total Amount', '% of Total'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claimsAging.map(b => (
                <tr key={b.bucket} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{b.bucket}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{b.count}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(b.amount)}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{((b.amount / agingTotal) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Reinsurance Recovery Trend">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={reinsuranceRecoveries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Area type="monotone" dataKey="submitted" stroke={COLORS.light} fill="#f6f1f9" strokeWidth={2} name="Submitted" />
              <Area type="monotone" dataKey="recovered" stroke={COLORS.teal} fill="#f0fdfa" strokeWidth={2} name="Recovered" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Payer Mix Analysis" style={{ marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Payer', 'Members', 'Annual Revenue', 'PEPM', 'Margin %'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payerMix.map(p => (
              <tr key={p.payer} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{p.payer}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{p.members.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(p.revenue)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{formatCurrency(p.pepm)}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                    background: p.margin >= 5 ? '#dcfce7' : p.margin >= 3 ? '#fef3c7' : '#fee2e2',
                    color: p.margin >= 5 ? '#166534' : p.margin >= 3 ? '#92400e' : '#991b1b',
                  }}>{p.margin}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Utilization Trend (Monthly)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={utilizationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="primaryCare" stroke={COLORS.teal} strokeWidth={2} name="Primary Care" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="outpatient" stroke={COLORS.purple} strokeWidth={2} name="Outpatient" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="er" stroke={COLORS.amber} strokeWidth={2} name="ER Visits" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="inpatient" stroke="#ef4444" strokeWidth={2} name="Inpatient" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Regulatory & Compliance Reporting">
          {regulatoryReports.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#452d5a' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Due: {r.dueDate}</div>
              </div>
              <div style={{ width: 100 }}>
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                  <div style={{
                    width: `${r.completion}%`, height: '100%', borderRadius: 3,
                    background: r.completion >= 80 ? '#22c55e' : r.completion >= 40 ? '#f59e0b' : '#e2e8f0',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#452d5a', width: 35, textAlign: 'right' }}>{r.completion}%</div>
              <span style={{
                padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                background: r.status === 'in_progress' ? '#fef3c7' : '#f1f5f9',
                color: r.status === 'in_progress' ? '#92400e' : '#64748b',
              }}>
                {r.status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED'}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
