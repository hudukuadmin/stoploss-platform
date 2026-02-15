import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import MetricCard from '../../components/common/MetricCard';
import Card from '../../components/common/Card';
import InsightsBar from '../../components/common/InsightsBar';
import { TrendingDown, Award, Shield, Users } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const financialSummary = [
  { month: 'Sep', revenue: 2850000, claims: 2120000, savings: 350000 },
  { month: 'Oct', revenue: 2920000, claims: 2280000, savings: 430000 },
  { month: 'Nov', revenue: 2980000, claims: 2150000, savings: 320000 },
  { month: 'Dec', revenue: 3050000, claims: 2480000, savings: 265000 },
  { month: 'Jan', revenue: 3120000, claims: 2350000, savings: 458000 },
  { month: 'Feb', revenue: 3180000, claims: 2290000, savings: 572000 },
];

const qualitySnapshot = [
  { measure: 'Preventive Screenings', score: 82, target: 85, status: 'near' },
  { measure: 'Chronic Disease Mgmt', score: 76, target: 80, status: 'near' },
  { measure: 'Readmission Rate', score: 11.2, target: 10, status: 'miss' },
  { measure: 'Patient Satisfaction', score: 87, target: 90, status: 'near' },
  { measure: 'Care Gap Close Rate', score: 86, target: 85, status: 'met' },
];

const memberRisk = [
  { name: 'Low Risk', value: 8200 },
  { name: 'Rising Risk', value: 3800 },
  { name: 'High Risk', value: 1650 },
  { name: 'Very High Risk', value: 350 },
];
const RISK_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

const contractPerformance = [
  { contract: 'Pacific Health ACO', type: 'Shared Risk', members: 4500, savings: 520000, lossRatio: 74.2 },
  { contract: 'Midwest Provider Net', type: 'Full Risk', members: 2200, savings: -85000, lossRatio: 92.1 },
  { contract: 'Southeast TPA', type: 'Shared Savings', members: 8100, savings: 380000, lossRatio: 78.5 },
];

const claimsTrend = [
  { month: 'Sep', pepm: 285, benchmark: 268 },
  { month: 'Oct', pepm: 292, benchmark: 272 },
  { month: 'Nov', pepm: 305, benchmark: 278 },
  { month: 'Dec', pepm: 312, benchmark: 282 },
  { month: 'Jan', pepm: 328, benchmark: 288 },
  { month: 'Feb', pepm: 335, benchmark: 292 },
];

const alerts = [
  { type: 'warning', message: '3 members flagged as predicted high-cost claimants', link: '/high-cost-claimants' },
  { type: 'info', message: 'Q1 2026 shared savings reconciliation due Mar 31', link: '/reporting-analytics' },
  { type: 'warning', message: 'Readmission rate trending above target (11.2% vs 10%)', link: '/value-analytics' },
  { type: 'success', message: 'Care gap close rate exceeded target: 86% vs 85%', link: '/value-analytics' },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Provider Dashboard
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Clinical performance, financial outcomes, and value-based care metrics at a glance.
      </p>

      <InsightsBar />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Members" value="14,800" icon={<Users size={22} />} trend="Across 3 contracts" />
        <MetricCard label="YTD Shared Savings" value={formatCurrency(1920000)} icon={<TrendingDown size={22} />} trend="+18% vs prior year" />
        <MetricCard label="Quality Score" value="81.4%" icon={<Award size={22} />} trend="Composite weighted" />
        <MetricCard label="Reinsurance Coverage" value={formatCurrency(5830000)} icon={<Shield size={22} />} trend="14 active policies" />
      </div>

      <div style={{ marginBottom: 24, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#452d5a' }}>Alerts & Action Items</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {alerts.map((a, i) => (
            <div
              key={i}
              onClick={() => navigate(a.link)}
              style={{
                padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                background: a.type === 'warning' ? '#fef3c7' : a.type === 'success' ? '#dcfce7' : '#f0f9ff',
                color: a.type === 'warning' ? '#92400e' : a.type === 'success' ? '#166534' : '#075985',
                borderLeft: `3px solid ${a.type === 'warning' ? '#f59e0b' : a.type === 'success' ? '#22c55e' : '#0ea5e9'}`,
              }}
            >
              {a.message}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Revenue vs Claims vs Savings">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={financialSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="revenue" fill="#6f4891" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="claims" fill="#8d5ead" name="Claims" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#0d9488" name="Savings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Member Risk Stratification">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={memberRisk} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={3} dataKey="value">
                {memberRisk.map((_e, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number | undefined) => `${(v ?? 0).toLocaleString()} members`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Quality Measure Snapshot">
          {qualitySnapshot.map(q => (
            <div key={q.measure} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>{q.measure}</div>
              <div style={{ width: 80 }}>
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                  <div style={{ width: `${Math.min(q.score, 100)}%`, height: '100%', borderRadius: 3, background: q.status === 'met' ? '#22c55e' : q.status === 'near' ? '#f59e0b' : '#ef4444' }} />
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, width: 45, textAlign: 'right', color: '#452d5a' }}>{q.score}%</div>
              <span style={{
                padding: '2px 6px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                background: q.status === 'met' ? '#dcfce7' : q.status === 'near' ? '#fef3c7' : '#fee2e2',
                color: q.status === 'met' ? '#166534' : q.status === 'near' ? '#92400e' : '#991b1b',
              }}>{q.status === 'met' ? 'MET' : q.status === 'near' ? 'NEAR' : 'MISS'}</span>
            </div>
          ))}
        </Card>

        <Card title="PEPM Trend vs Benchmark">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={claimsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number | undefined) => `$${v ?? 0}`} />
              <Legend />
              <Area type="monotone" dataKey="pepm" stroke="#6f4891" fill="#f6f1f9" strokeWidth={2} name="Your PEPM" />
              <Area type="monotone" dataKey="benchmark" stroke="#0d9488" fill="#f0fdfa" strokeWidth={2} name="Benchmark" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Contract Performance">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Contract', 'Type', 'Members', 'Shared Savings', 'Loss Ratio', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contractPerformance.map(c => (
              <tr key={c.contract} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{c.contract}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{c.type}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.members.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: c.savings >= 0 ? '#166534' : '#991b1b' }}>{formatCurrency(c.savings)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.lossRatio}%</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                    background: c.lossRatio < 80 ? '#dcfce7' : c.lossRatio < 90 ? '#fef3c7' : '#fee2e2',
                    color: c.lossRatio < 80 ? '#166534' : c.lossRatio < 90 ? '#92400e' : '#991b1b',
                  }}>{c.lossRatio < 80 ? 'ON TRACK' : c.lossRatio < 90 ? 'WATCH' : 'AT RISK'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
