import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area, LineChart, Line,
} from 'recharts';
import MetricCard from '../../components/common/MetricCard';
import Card from '../../components/common/Card';
import InsightsBar from '../../components/common/InsightsBar';
import { Shield, DollarSign, BookOpen, Percent } from 'lucide-react';

const COLORS = ['#6f4891', '#0d9488', '#8d5ead', '#f59e0b', '#ef4444'];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const bookSummary = [
  { month: 'Sep', written: 850000, earned: 810000, incurred: 580000, lossRatio: 71.6 },
  { month: 'Oct', written: 920000, earned: 870000, incurred: 650000, lossRatio: 74.7 },
  { month: 'Nov', written: 880000, earned: 860000, incurred: 610000, lossRatio: 70.9 },
  { month: 'Dec', written: 1050000, earned: 920000, incurred: 720000, lossRatio: 78.3 },
  { month: 'Jan', written: 980000, earned: 950000, incurred: 690000, lossRatio: 72.6 },
  { month: 'Feb', written: 1120000, earned: 1020000, incurred: 730000, lossRatio: 71.6 },
];

const coverageExposure = [
  { name: 'Specific Stop Loss', value: 3200000 },
  { name: 'Aggregate Stop Loss', value: 1800000 },
  { name: 'Quota Share', value: 1100000 },
  { name: 'Surety Bonds', value: 450000 },
];

const lossTriangle = [
  { development: '12 mos', ay2023: 68.2, ay2024: 72.1, ay2025: 74.8 },
  { development: '24 mos', ay2023: 72.5, ay2024: 76.3, ay2025: null },
  { development: '36 mos', ay2023: 73.8, ay2024: null, ay2025: null },
  { development: 'Ultimate', ay2023: 74.2, ay2024: 77.8, ay2025: 78.5 },
];

const largeClaimsExposure = [
  { tier: '$250K - $500K', count: 12, totalExposure: 4200000, avgClaim: 350000 },
  { tier: '$500K - $750K', count: 5, totalExposure: 3100000, avgClaim: 620000 },
  { tier: '$750K - $1M', count: 3, totalExposure: 2550000, avgClaim: 850000 },
  { tier: '$1M+', count: 2, totalExposure: 2800000, avgClaim: 1400000 },
];

const reserveTrend = [
  { month: 'Sep', ibnr: 1200000, caseReserve: 2800000, total: 4000000 },
  { month: 'Oct', ibnr: 1350000, caseReserve: 2950000, total: 4300000 },
  { month: 'Nov', ibnr: 1180000, caseReserve: 3100000, total: 4280000 },
  { month: 'Dec', ibnr: 1420000, caseReserve: 3250000, total: 4670000 },
  { month: 'Jan', ibnr: 1280000, caseReserve: 3050000, total: 4330000 },
  { month: 'Feb', ibnr: 1310000, caseReserve: 3180000, total: 4490000 },
];

const cedentPerformance = [
  { cedent: 'Pacific Health ACO', policies: 3, premium: 1420000, lossRatio: 68.2, trend: 'stable', exposure: 4200000 },
  { cedent: 'Midwest Provider Net', policies: 2, premium: 840000, lossRatio: 88.5, trend: 'worsening', exposure: 2800000 },
  { cedent: 'Southeast TPA Solutions', policies: 4, premium: 2180000, lossRatio: 72.1, trend: 'improving', exposure: 5100000 },
  { cedent: 'Northeast ACO Partners', policies: 2, premium: 980000, lossRatio: 76.3, trend: 'stable', exposure: 3200000 },
  { cedent: 'Gulf Coast Health Group', policies: 1, premium: 620000, lossRatio: 91.2, trend: 'worsening', exposure: 1850000 },
];

const lossRatioTrend = [
  { month: 'Sep', actual: 71.6, expected: 75, ultimate: 74.2 },
  { month: 'Oct', actual: 74.7, expected: 75, ultimate: 74.8 },
  { month: 'Nov', actual: 70.9, expected: 75, ultimate: 74.5 },
  { month: 'Dec', actual: 78.3, expected: 75, ultimate: 75.1 },
  { month: 'Jan', actual: 72.6, expected: 75, ultimate: 74.9 },
  { month: 'Feb', actual: 71.6, expected: 75, ultimate: 74.6 },
];

export default function ReinsurerDashboard() {
  const navigate = useNavigate();
  const totalPremium = bookSummary.reduce((s, m) => s + m.earned, 0);
  const totalIncurred = bookSummary.reduce((s, m) => s + m.incurred, 0);
  const overallLossRatio = (totalIncurred / totalPremium * 100).toFixed(1);
  const totalExposure = coverageExposure.reduce((s, c) => s + c.value, 0);
  const totalReserves = reserveTrend[reserveTrend.length - 1].total;

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Re-insurer Dashboard
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Book of business performance, loss development, reserve adequacy, and portfolio exposure analysis.
      </p>

      <InsightsBar />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Earned Premium" value={formatCurrency(totalPremium)} icon={<DollarSign size={22} />} trend="6-month period" />
        <MetricCard label="Combined Loss Ratio" value={`${overallLossRatio}%`} icon={<Percent size={22} />} trend="Target: < 75%" />
        <MetricCard label="Total Exposure" value={formatCurrency(totalExposure)} icon={<Shield size={22} />} trend="Across all products" />
        <MetricCard label="Total Reserves" value={formatCurrency(totalReserves)} icon={<BookOpen size={22} />} trend="IBNR + Case" />
      </div>

      <div style={{
        marginBottom: 24, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      }}>
        <div
          onClick={() => navigate('/high-cost-claimants')}
          style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: '#fee2e2', color: '#991b1b', borderLeft: '3px solid #ef4444' }}
        >
          2 cedents with loss ratio &gt; 85% require intervention review
        </div>
        <div
          onClick={() => navigate('/claims-insights')}
          style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: '#fef3c7', color: '#92400e', borderLeft: '3px solid #f59e0b' }}
        >
          22 large claims (&gt;$250K) in development - 3 approaching specific attachment
        </div>
        <div
          onClick={() => navigate('/policies')}
          style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: '#f0f9ff', color: '#075985', borderLeft: '3px solid #0ea5e9' }}
        >
          12 active policies across 5 cedents | 3 pending renewals
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 12, background: '#dcfce7', color: '#166534', borderLeft: '3px solid #22c55e' }}>
          Reserve adequacy within 5% of actuarial estimate - favorable development
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Written vs Earned vs Incurred Premium">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="written" fill="#8d5ead" name="Written" radius={[4, 4, 0, 0]} />
              <Bar dataKey="earned" fill="#6f4891" name="Earned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="incurred" fill="#ef4444" name="Incurred" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Coverage Exposure by Product">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={coverageExposure} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={3} dataKey="value">
                {coverageExposure.map((_e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Loss Ratio Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lossRatioTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[65, 85]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#6f4891" strokeWidth={2} name="Actual" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expected" stroke="#ef4444" strokeWidth={2} name="Expected" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="ultimate" stroke="#0d9488" strokeWidth={2} name="Ultimate Est." dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Reserve Adequacy Trend">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={reserveTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Area type="monotone" dataKey="caseReserve" stroke="#6f4891" fill="#f6f1f9" strokeWidth={2} name="Case Reserve" stackId="1" />
              <Area type="monotone" dataKey="ibnr" stroke="#0d9488" fill="#f0fdfa" strokeWidth={2} name="IBNR" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Large Claims Exposure">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Tier', 'Count', 'Total Exposure', 'Avg Claim'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {largeClaimsExposure.map(l => (
                <tr key={l.tier} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => navigate('/high-cost-claimants')}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{l.tier}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{l.count}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(l.totalExposure)}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13, color: '#64748b' }}>{formatCurrency(l.avgClaim)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Loss Development Triangle">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Development', 'AY 2023', 'AY 2024', 'AY 2025'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lossTriangle.map(l => (
                <tr key={l.development} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{l.development}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{l.ay2023 != null ? `${l.ay2023}%` : '-'}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{l.ay2024 != null ? `${l.ay2024}%` : '-'}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13, fontStyle: l.development === 'Ultimate' ? 'italic' : 'normal' }}>{l.ay2025 != null ? `${l.ay2025}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
            Ultimate estimates based on Bornhuetter-Ferguson method
          </div>
        </Card>
      </div>

      <Card title="Cedent Performance">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Cedent', 'Policies', 'Premium', 'Loss Ratio', 'Exposure', 'Trend', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cedentPerformance.map(c => (
              <tr key={c.cedent} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{c.cedent}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.policies}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(c.premium)}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                    background: c.lossRatio < 75 ? '#dcfce7' : c.lossRatio < 85 ? '#fef3c7' : '#fee2e2',
                    color: c.lossRatio < 75 ? '#166534' : c.lossRatio < 85 ? '#92400e' : '#991b1b',
                  }}>{c.lossRatio}%</span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{formatCurrency(c.exposure)}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: c.trend === 'improving' ? '#166534' : c.trend === 'stable' ? '#64748b' : '#991b1b',
                  }}>{c.trend === 'improving' ? '↗ Improving' : c.trend === 'stable' ? '→ Stable' : '↘ Worsening'}</span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  {c.lossRatio > 85 && (
                    <button
                      onClick={() => navigate('/underwriting')}
                      style={{
                        padding: '3px 10px', fontSize: 10, fontWeight: 600, border: 'none', borderRadius: 4, cursor: 'pointer',
                        background: '#fee2e2', color: '#991b1b',
                      }}
                    >
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
