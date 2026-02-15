import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Card from '../../components/common/Card';
import MetricCard from '../../components/common/MetricCard';
import { Heart, TrendingDown, Target, Award } from 'lucide-react';

const COLORS = ['#6f4891', '#0d9488', '#8d5ead', '#f59e0b', '#ef4444'];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const qualityScores = [
  { measure: 'Preventive Screenings', target: 85, actual: 82, benchmark: 78, weight: 20 },
  { measure: 'Chronic Disease Mgmt', target: 80, actual: 76, benchmark: 72, weight: 25 },
  { measure: 'Hospital Readmission Rate', target: 10, actual: 11.2, benchmark: 13.5, weight: 20 },
  { measure: 'Patient Satisfaction (CAHPS)', target: 90, actual: 87, benchmark: 84, weight: 15 },
  { measure: 'Medication Adherence', target: 82, actual: 79, benchmark: 75, weight: 10 },
  { measure: 'ED Utilization Rate', target: 350, actual: 382, benchmark: 420, weight: 10 },
];

const sharedSavings = [
  { quarter: 'Q1 2025', benchmark: 4200000, actual: 3850000, savings: 350000 },
  { quarter: 'Q2 2025', benchmark: 4350000, actual: 3920000, savings: 430000 },
  { quarter: 'Q3 2025', benchmark: 4500000, actual: 4180000, savings: 320000 },
  { quarter: 'Q4 2025', benchmark: 4650000, actual: 4350000, savings: 300000 },
  { quarter: 'Q1 2026', benchmark: 4800000, actual: 4280000, savings: 520000 },
];

const careGapsClosed = [
  { month: 'Sep 2025', gaps: 342, closed: 285 },
  { month: 'Oct 2025', gaps: 356, closed: 298 },
  { month: 'Nov 2025', gaps: 320, closed: 278 },
  { month: 'Dec 2025', gaps: 388, closed: 310 },
  { month: 'Jan 2026', gaps: 365, closed: 325 },
  { month: 'Feb 2026', gaps: 372, closed: 338 },
];

const riskAdjustment = [
  { category: 'HCC Capture Rate', value: 78, target: 85 },
  { category: 'RAF Score Accuracy', value: 0.92, target: 0.95 },
  { category: 'Suspected Conditions Coded', value: 68, target: 80 },
  { category: 'Annual Wellness Visits', value: 72, target: 82 },
];

const contractPerformance = [
  { name: 'Shared Savings', value: 42 },
  { name: 'Shared Risk', value: 28 },
  { name: 'Full Risk', value: 18 },
  { name: 'Global Capitation', value: 12 },
];

export default function ValueAnalyticsPage() {
  const totalSavings = sharedSavings.reduce((s, q) => s + q.savings, 0);
  const avgCloseRate = careGapsClosed.reduce((s, m) => s + (m.closed / m.gaps), 0) / careGapsClosed.length;

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Value Analytics
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Track value-based care performance, quality measures, shared savings, risk adjustment accuracy, and care gap closure rates across your contracts.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Shared Savings" value={formatCurrency(totalSavings)} icon={<TrendingDown size={22} />} trend="5 quarters cumulative" />
        <MetricCard label="Quality Score" value="81.4%" icon={<Award size={22} />} trend="Composite weighted score" />
        <MetricCard label="Care Gap Close Rate" value={`${(avgCloseRate * 100).toFixed(1)}%`} icon={<Heart size={22} />} trend="6-month average" />
        <MetricCard label="HCC Capture Rate" value="78%" icon={<Target size={22} />} trend="Target: 85%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Shared Savings Performance by Quarter">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sharedSavings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="benchmark" fill="#e2e8f0" name="Benchmark" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#6f4891" name="Actual Spend" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#0d9488" name="Savings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Contract Type Mix">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={contractPerformance} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                {contractPerformance.map((_e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Quality Measure Scorecard" style={{ marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Measure', 'Weight', 'Target', 'Actual', 'Benchmark', 'vs Target', 'vs Benchmark'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {qualityScores.map(q => {
              const vsTarget = q.measure.includes('Readmission') || q.measure.includes('ED')
                ? q.actual <= q.target : q.actual >= q.target;
              const vsBench = q.measure.includes('Readmission') || q.measure.includes('ED')
                ? q.actual <= q.benchmark : q.actual >= q.benchmark;
              const formatVal = (v: number) => q.measure.includes('ED') ? v.toLocaleString() + '/1K' : v + '%';
              return (
                <tr key={q.measure} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{q.measure}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{q.weight}%</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{formatVal(q.target)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatVal(q.actual)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#64748b' }}>{formatVal(q.benchmark)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: vsTarget ? '#dcfce7' : '#fef3c7', color: vsTarget ? '#166534' : '#92400e' }}>
                      {vsTarget ? 'MET' : 'BELOW'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: vsBench ? '#dcfce7' : '#fee2e2', color: vsBench ? '#166534' : '#991b1b' }}>
                      {vsBench ? 'ABOVE' : 'BELOW'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Care Gap Closure Trend">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={careGapsClosed}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="gaps" fill="#e2e8f0" name="Total Gaps" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" fill="#0d9488" name="Gaps Closed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risk Adjustment Accuracy">
          {riskAdjustment.map(r => (
            <div key={r.category} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 180, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>{r.category}</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, position: 'relative' }}>
                  <div style={{ width: `${typeof r.value === 'number' && r.value < 1 ? r.value * 100 : Math.min(r.value, 100)}%`, height: '100%', background: '#6f4891', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', left: `${typeof r.target === 'number' && r.target < 1 ? r.target * 100 : Math.min(r.target, 100)}%`, top: -3, width: 2, height: 14, background: '#ef4444' }} />
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#452d5a', width: 50, textAlign: 'right' }}>
                {typeof r.value === 'number' && r.value < 1 ? (r.value * 100).toFixed(0) : r.value}%
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: '#6f4891', borderRadius: 2, marginRight: 4 }} /> Actual
            <span style={{ display: 'inline-block', width: 8, height: 2, background: '#ef4444', marginLeft: 12, marginRight: 4 }} /> Target
          </div>
        </Card>
      </div>
    </div>
  );
}
