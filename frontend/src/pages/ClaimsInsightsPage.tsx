import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
  AreaChart, Area,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { TrendingUp, Target, Brain, Percent } from 'lucide-react';

const COLORS = { purple: '#6f4891', teal: '#0d9488', light: '#8d5ead', amber: '#f59e0b' };

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const claimsTrend = [
  { month: 'Mar 2025', actual: 285, benchmark: 268, predicted: null },
  { month: 'Apr 2025', actual: 292, benchmark: 272, predicted: null },
  { month: 'May 2025', actual: 305, benchmark: 278, predicted: null },
  { month: 'Jun 2025', actual: 312, benchmark: 282, predicted: null },
  { month: 'Jul 2025', actual: 328, benchmark: 288, predicted: null },
  { month: 'Aug 2025', actual: 335, benchmark: 292, predicted: null },
  { month: 'Sep 2025', actual: 348, benchmark: 298, predicted: null },
  { month: 'Oct 2025', actual: 356, benchmark: 302, predicted: null },
  { month: 'Nov 2025', actual: 365, benchmark: 308, predicted: null },
  { month: 'Dec 2025', actual: 378, benchmark: 312, predicted: null },
  { month: 'Jan 2026', actual: 388, benchmark: 318, predicted: null },
  { month: 'Feb 2026', actual: 395, benchmark: 322, predicted: null },
  { month: 'Mar 2026', actual: null, benchmark: null, predicted: 408 },
  { month: 'Apr 2026', actual: null, benchmark: null, predicted: 418 },
  { month: 'May 2026', actual: null, benchmark: null, predicted: 432 },
  { month: 'Jun 2026', actual: null, benchmark: null, predicted: 445 },
];

const benchmarkComparison = [
  { category: 'Cancer', yours: 87500, benchmark: 72000, gap: '+21.5%' },
  { category: 'Cardiovascular', yours: 42200, benchmark: 38500, gap: '+9.6%' },
  { category: 'Musculoskeletal', yours: 28600, benchmark: 31200, gap: '-8.3%' },
  { category: 'Diabetes', yours: 18900, benchmark: 20100, gap: '-6.0%' },
  { category: 'Behavioral Health', yours: 15400, benchmark: 12800, gap: '+20.3%' },
  { category: 'Pharmacy', yours: 168, benchmark: 142, gap: '+18.3%' },
];

const predictedHighCost = [
  { member: 'M-4821', riskScore: 0.92, predictedCost: 425000, topCondition: 'Oncology - Stage III', confidence: 0.88, status: 'flagged' },
  { member: 'M-2156', riskScore: 0.87, predictedCost: 380000, topCondition: 'Cardiovascular - CABG', confidence: 0.82, status: 'flagged' },
  { member: 'M-7392', riskScore: 0.84, predictedCost: 310000, topCondition: 'Transplant Candidate', confidence: 0.79, status: 'monitoring' },
  { member: 'M-1048', riskScore: 0.81, predictedCost: 275000, topCondition: 'Oncology - Recurrence', confidence: 0.76, status: 'monitoring' },
  { member: 'M-5563', riskScore: 0.78, predictedCost: 245000, topCondition: 'MS - Progressive', confidence: 0.74, status: 'monitoring' },
  { member: 'M-8901', riskScore: 0.75, predictedCost: 220000, topCondition: 'Cardiovascular - CHF', confidence: 0.71, status: 'review' },
  { member: 'M-3347', riskScore: 0.72, predictedCost: 195000, topCondition: 'Renal Failure', confidence: 0.68, status: 'review' },
  { member: 'M-6215', riskScore: 0.70, predictedCost: 180000, topCondition: 'Oncology - New Dx', confidence: 0.65, status: 'review' },
];

const lossRatioTrend = [
  { month: 'Mar 2025', lossRatio: 72.5 },
  { month: 'Apr 2025', lossRatio: 71.8 },
  { month: 'May 2025', lossRatio: 73.2 },
  { month: 'Jun 2025', lossRatio: 74.1 },
  { month: 'Jul 2025', lossRatio: 75.8 },
  { month: 'Aug 2025', lossRatio: 74.6 },
  { month: 'Sep 2025', lossRatio: 76.2 },
  { month: 'Oct 2025', lossRatio: 77.5 },
  { month: 'Nov 2025', lossRatio: 76.8 },
  { month: 'Dec 2025', lossRatio: 78.1 },
  { month: 'Jan 2026', lossRatio: 77.4 },
  { month: 'Feb 2026', lossRatio: 78.8 },
];

const financingStrategies = [
  {
    title: 'Stop-Loss Reinsurance',
    description: 'Primary tool for transferring high-cost claimant risk. Specific and aggregate coverage protects against catastrophic claims.',
    status: 'Active',
    impact: '14 policies in-force, $5.83M premium',
  },
  {
    title: 'Captive Insurance',
    description: 'Employee benefit cell captives enable self-insurance with captive structure advantages. Consider for groups with favorable loss experience.',
    status: 'Available',
    impact: '3 groups eligible based on risk profile',
  },
  {
    title: 'Health Risk Financing',
    description: 'Credit-based solutions to convert budget hits to steady payment streams. Fill coverage gaps, improve capital efficiency, and smooth cash flow.',
    status: 'Available',
    impact: 'Applicable for lasered members and coverage gaps',
  },
];

export default function ClaimsInsightsPage() {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Claims Insights & Predictive Analytics
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Leverage predictive modeling and precision benchmarking to forecast future risk, identify high-cost claimants before they occur, and implement targeted mitigation strategies.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Predicted Next-Qtr PEPM" value="$432" icon={<Brain size={22} />} trend="+9.4% vs current" />
        <MetricCard label="Flagged High-Cost Members" value="8" icon={<Target size={22} />} trend="Predicted $2.2M+ exposure" />
        <MetricCard label="Benchmark Variance" value="+7.2%" icon={<TrendingUp size={22} />} trend="Above matched peer group" />
        <MetricCard label="Current Loss Ratio" value="78.8%" icon={<Percent size={22} />} trend="Trending up from 72.5%" />
      </div>

      <Card title="Claims PEPM Trend: Actual vs Benchmark vs Predicted" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
          Your population is compared against a precision-matched benchmark group. The predicted line uses machine learning to forecast future PEPM based on your population's risk profile, claims patterns, and demographics.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={claimsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} domain={[240, 460]} />
            <Tooltip formatter={(v: number | undefined) => v != null ? `$${v}` : '-'} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke={COLORS.purple} strokeWidth={2} dot={{ fill: COLORS.purple, r: 3 }} name="Your Population" connectNulls={false} />
            <Line type="monotone" dataKey="benchmark" stroke={COLORS.teal} strokeWidth={2} dot={{ fill: COLORS.teal, r: 3 }} name="Matched Benchmark" strokeDasharray="5 5" connectNulls={false} />
            <Line type="monotone" dataKey="predicted" stroke={COLORS.amber} strokeWidth={2} dot={{ fill: COLORS.amber, r: 3 }} name="ML Predicted" strokeDasharray="3 3" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Precision Benchmarking by Category">
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
            Comparing your cost drivers against a precision-matched benchmark population reveals true areas of opportunity. Negative gaps indicate you outperform the benchmark.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={benchmarkComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v: number | undefined) => (v ?? 0) > 1000 ? formatCurrency(v ?? 0) : `$${v ?? 0} PEPM`} />
              <Legend />
              <Bar dataKey="yours" fill={COLORS.purple} name="Your Population" radius={[0, 4, 4, 0]} />
              <Bar dataKey="benchmark" fill={COLORS.teal} name="Benchmark" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Loss Ratio Trend">
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
            Regular measurement and evaluation determine if cost mitigation strategies are working. Ongoing monitoring is key to long-term success.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={lossRatioTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[68, 82]} />
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
              <Area type="monotone" dataKey="lossRatio" stroke={COLORS.purple} fill="#f6f1f9" strokeWidth={2} name="Loss Ratio" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Predictive High-Cost Claimant Identification" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Advanced machine learning forecasts future population risk and identifies potential high-cost claimants before they occur. Early intervention enables targeted care management and cost mitigation.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Member ID', 'Risk Score', 'Predicted Annual Cost', 'Top Condition', 'Model Confidence', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {predictedHighCost.map(m => (
              <tr key={m.member} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#6f4891' }}>{m.member}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                      <div style={{ width: `${m.riskScore * 100}%`, height: '100%', background: m.riskScore > 0.85 ? '#ef4444' : m.riskScore > 0.75 ? '#f59e0b' : '#eab308', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{(m.riskScore * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(m.predictedCost)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#452d5a' }}>{m.topCondition}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{(m.confidence * 100).toFixed(0)}%</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                    background: m.status === 'flagged' ? '#fee2e2' : m.status === 'monitoring' ? '#fef3c7' : '#f6f1f9',
                    color: m.status === 'flagged' ? '#991b1b' : m.status === 'monitoring' ? '#92400e' : '#452d5a',
                  }}>{m.status.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Alternative Financing Strategies">
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Even with targeted mitigation, external factors may drive costs up. Consider these financing strategies to protect against high-cost claimant volatility and manage budget impact.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {financingStrategies.map(s => (
            <div key={s.title} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #6f4891' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#452d5a' }}>{s.title}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                  background: s.status === 'Active' ? '#dcfce7' : '#e8d5f5',
                  color: s.status === 'Active' ? '#166534' : '#452d5a',
                }}>{s.status}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>{s.description}</p>
              <div style={{ fontSize: 11, color: '#6f4891', fontWeight: 600 }}>{s.impact}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
