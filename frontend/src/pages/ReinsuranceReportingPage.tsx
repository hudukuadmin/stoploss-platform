import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
  LineChart, Line,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { TrendingUp, DollarSign, Shield, Percent } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const premiumSummary = [
  { month: 'Sep 2025', written: 850000, earned: 810000, ceded: 162000 },
  { month: 'Oct 2025', written: 920000, earned: 870000, ceded: 174000 },
  { month: 'Nov 2025', written: 880000, earned: 860000, ceded: 172000 },
  { month: 'Dec 2025', written: 1050000, earned: 920000, ceded: 184000 },
  { month: 'Jan 2026', written: 980000, earned: 950000, ceded: 190000 },
  { month: 'Feb 2026', written: 1120000, earned: 1020000, ceded: 204000 },
];

const recoverySummary = [
  { month: 'Sep 2025', submitted: 680000, recovered: 612000, outstanding: 68000 },
  { month: 'Oct 2025', submitted: 750000, recovered: 690000, outstanding: 60000 },
  { month: 'Nov 2025', submitted: 520000, recovered: 475000, outstanding: 45000 },
  { month: 'Dec 2025', submitted: 890000, recovered: 810000, outstanding: 80000 },
  { month: 'Jan 2026', submitted: 720000, recovered: 648000, outstanding: 72000 },
  { month: 'Feb 2026', submitted: 830000, recovered: 0, outstanding: 830000 },
];

const lossRatioByProduct = [
  { product: 'Specific Stop Loss', premium: 2800000, incurred: 2100000, lossRatio: 75.0 },
  { product: 'Aggregate Stop Loss', premium: 1500000, incurred: 1020000, lossRatio: 68.0 },
  { product: 'Quota Share', premium: 950000, incurred: 760000, lossRatio: 80.0 },
  { product: 'Surety Bonds', premium: 380000, incurred: 210000, lossRatio: 55.3 },
];

const reinsurerPerformance = [
  { reinsurer: 'Aon Re', policies: 5, premiumCeded: 2400000, claimsRecovered: 1850000, recoveryRate: 95.2, outstandingClaims: 3, rating: 'A+' },
  { reinsurer: 'Swiss Re', policies: 4, premiumCeded: 1800000, claimsRecovered: 1420000, recoveryRate: 92.8, outstandingClaims: 2, rating: 'AA-' },
  { reinsurer: 'Munich Re', policies: 3, premiumCeded: 1430000, claimsRecovered: 1165000, recoveryRate: 94.1, outstandingClaims: 1, rating: 'AA-' },
];

const lossRatioTrend = [
  { month: 'Sep 2025', specific: 72.1, aggregate: 65.2, overall: 70.8 },
  { month: 'Oct 2025', specific: 75.8, aggregate: 68.5, overall: 74.2 },
  { month: 'Nov 2025', specific: 70.2, aggregate: 62.8, overall: 68.5 },
  { month: 'Dec 2025', specific: 78.5, aggregate: 71.2, overall: 76.8 },
  { month: 'Jan 2026', specific: 73.4, aggregate: 66.8, overall: 72.1 },
  { month: 'Feb 2026', specific: 71.8, aggregate: 64.5, overall: 70.2 },
];

const keyMetrics = [
  { metric: 'Net Retention Ratio', value: '80%', description: 'Portion of risk retained after cession' },
  { metric: 'Cession Rate', value: '20%', description: 'Premium ceded to reinsurers' },
  { metric: 'Recovery Efficiency', value: '94.1%', description: 'Claims recovered vs submitted' },
  { metric: 'Treaty Utilization', value: '68%', description: 'Capacity used vs available' },
  { metric: 'Aggregate Attachment', value: '125%', description: 'Aggregate corridor threshold' },
  { metric: 'Specific Deductible', value: '$250,000', description: 'Individual stop-loss level' },
];

export default function ReinsuranceReportingPage() {
  const totalPremium = premiumSummary.reduce((s, m) => s + m.earned, 0);
  const totalCeded = premiumSummary.reduce((s, m) => s + m.ceded, 0);
  const totalRecovered = recoverySummary.reduce((s, r) => s + r.recovered, 0);
  const totalOutstanding = recoverySummary.reduce((s, r) => s + r.outstanding, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Reinsurance Reporting
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Comprehensive reinsurance program performance: premium flow, recovery tracking, loss ratios by product line, reinsurer performance, and treaty utilization.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Earned Premium" value={formatCurrency(totalPremium)} icon={<DollarSign size={22} />} trend="6-month period" />
        <MetricCard label="Premium Ceded" value={formatCurrency(totalCeded)} icon={<Shield size={22} />} trend={`${((totalCeded / totalPremium) * 100).toFixed(1)}% cession rate`} />
        <MetricCard label="Claims Recovered" value={formatCurrency(totalRecovered)} icon={<TrendingUp size={22} />} trend="From reinsurers" />
        <MetricCard label="Outstanding Recovery" value={formatCurrency(totalOutstanding)} icon={<Percent size={22} />} trend="Pending settlement" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Premium: Written vs Earned vs Ceded">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={premiumSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="written" fill="#8d5ead" name="Written" radius={[4, 4, 0, 0]} />
              <Bar dataKey="earned" fill="#6f4891" name="Earned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ceded" fill="#0d9488" name="Ceded" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recovery: Submitted vs Recovered">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={recoverySummary.filter(r => r.recovered > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Area type="monotone" dataKey="submitted" stroke="#8d5ead" fill="#f6f1f9" strokeWidth={2} name="Submitted" />
              <Area type="monotone" dataKey="recovered" stroke="#0d9488" fill="#f0fdfa" strokeWidth={2} name="Recovered" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Loss Ratio by Product Line">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Product', 'Premium', 'Incurred', 'Loss Ratio'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lossRatioByProduct.map(p => (
                <tr key={p.product} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{p.product}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{formatCurrency(p.premium)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{formatCurrency(p.incurred)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                        <div style={{ width: `${Math.min(p.lossRatio, 100)}%`, height: '100%', borderRadius: 3, background: p.lossRatio < 70 ? '#22c55e' : p.lossRatio < 80 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.lossRatio < 70 ? '#166534' : p.lossRatio < 80 ? '#92400e' : '#991b1b' }}>{p.lossRatio}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Loss Ratio Trend by Coverage">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lossRatioTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[55, 85]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
              <Legend />
              <Line type="monotone" dataKey="specific" stroke="#6f4891" strokeWidth={2} name="Specific" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="aggregate" stroke="#0d9488" strokeWidth={2} name="Aggregate" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="overall" stroke="#f59e0b" strokeWidth={2} name="Overall" strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Reinsurer Performance" style={{ marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Reinsurer', 'Rating', 'Policies', 'Premium Ceded', 'Claims Recovered', 'Recovery Rate', 'Outstanding'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reinsurerPerformance.map(r => (
              <tr key={r.reinsurer} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{r.reinsurer}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: '#dcfce7', color: '#166534' }}>{r.rating}</span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.policies}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(r.premiumCeded)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(r.claimsRecovered)}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: r.recoveryRate >= 94 ? '#166534' : '#92400e' }}>{r.recoveryRate}%</span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.outstandingClaims} claims</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Key Reinsurance Metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {keyMetrics.map(m => (
            <div key={m.metric} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>{m.metric}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#452d5a', marginBottom: 2 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.description}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
