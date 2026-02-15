import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { Heart, Pill, AlertTriangle, Activity } from 'lucide-react';

const COLORS = ['#6f4891', '#8d5ead', '#0d9488', '#f59e0b', '#ef4444', '#64748b'];

const costDriverBreakdown = [
  { name: 'Chronic Conditions', value: 38, amount: 2218000 },
  { name: 'High-Cost Claimants', value: 25, amount: 1460000 },
  { name: 'Pharmacy / GLP-1', value: 18, amount: 1051000 },
  { name: 'Emerging Conditions', value: 10, amount: 584000 },
  { name: 'External Factors', value: 9, amount: 526000 },
];

const chronicConditions = [
  { condition: 'Cancer (Oncology)', members: 142, avgCost: 87500, trend: '+12.3%', severity: 'high' },
  { condition: 'Cardiovascular Disease', members: 318, avgCost: 42200, trend: '+8.7%', severity: 'high' },
  { condition: 'Musculoskeletal', members: 485, avgCost: 28600, trend: '+6.2%', severity: 'moderate' },
  { condition: 'Diabetes (Type 2)', members: 392, avgCost: 18900, trend: '+9.1%', severity: 'moderate' },
  { condition: 'Behavioral Health', members: 267, avgCost: 15400, trend: '+14.8%', severity: 'moderate' },
  { condition: 'Respiratory / COPD', members: 198, avgCost: 22100, trend: '+5.4%', severity: 'low' },
];

const emergingConditions = [
  { condition: 'Gastrointestinal (IBD, Diverticulitis)', pepmIncrease: '+11.2%', note: 'Rising diagnosis in 20-30 age group' },
  { condition: 'Neurological (MS, Migraines, Seizures)', pepmIncrease: '+10.8%', note: 'Multiple sclerosis treatment costs surging' },
  { condition: 'Autoimmune Disorders', pepmIncrease: '+8.5%', note: 'New biologic therapies driving cost' },
  { condition: 'Gene / Cell Therapy Pipeline', pepmIncrease: 'Emerging', note: 'Multi-million-dollar treatments entering market' },
];

const highCostClaimantTiers = [
  { tier: '$100K - $250K', count: 28, totalSpend: 4200000 },
  { tier: '$250K - $500K', count: 14, totalSpend: 4900000 },
  { tier: '$500K - $1M', count: 6, totalSpend: 4200000 },
  { tier: '$1M+', count: 3, totalSpend: 4800000 },
];

const glp1Data = [
  { month: 'Jul 2025', spend: 82000, members: 145 },
  { month: 'Aug 2025', spend: 91000, members: 162 },
  { month: 'Sep 2025', spend: 105000, members: 184 },
  { month: 'Oct 2025', spend: 118000, members: 210 },
  { month: 'Nov 2025', spend: 128000, members: 231 },
  { month: 'Dec 2025', spend: 142000, members: 256 },
  { month: 'Jan 2026', spend: 155000, members: 278 },
  { month: 'Feb 2026', spend: 168000, members: 298 },
];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function CostDriversPage() {
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const totalClaimants = highCostClaimantTiers.reduce((s, t) => s + t.count, 0);
  const totalHCCSpend = highCostClaimantTiers.reduce((s, t) => s + t.totalSpend, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Cost Driver Analysis
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Identify and monitor key cost drivers unique to your population. Cost drivers vary by organization based on disease burden, demographics, geography, and social determinants of health.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Chronic Condition Spend" value={formatCurrency(2218000)} icon={<Heart size={22} />} trend="+9.5% YoY" />
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/high-cost-claimants')}>
          <MetricCard label="High-Cost Claimants" value={`${totalClaimants} members`} icon={<AlertTriangle size={22} />} trend="5% of members = 60% spend" />
        </div>
        <MetricCard label="GLP-1 Monthly Spend" value={formatCurrency(168000)} icon={<Pill size={22} />} trend="+105% YoY" />
        <MetricCard label="Medical Trend Rate" value="9.5%" icon={<Activity size={22} />} trend="2025 forecast" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Cost Driver Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costDriverBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                onClick={(_data, index) => setSelectedDriver(costDriverBreakdown[index].name)}
              >
                {costDriverBreakdown.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} style={{ cursor: 'pointer' }} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => `${value ?? 0}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {selectedDriver && (
            <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 13 }}>
              <strong>{selectedDriver}</strong>: {formatCurrency(costDriverBreakdown.find(d => d.name === selectedDriver)?.amount || 0)} annual spend
            </div>
          )}
        </Card>

        <Card title="GLP-1 Spend Trend">
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
            With expanded indications and increased demand, GLP-1 spend remains a major cost driver. 32% of employers are implementing management strategies.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={glp1Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Bar dataKey="spend" fill="#0d9488" radius={[4, 4, 0, 0]} name="GLP-1 Spend" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Chronic Clinical Conditions" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Cancer, cardiovascular and musculoskeletal issues continue to grow each year. Increased prevalence and complexity significantly drive overall costs.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Condition', 'Affected Members', 'Avg Annual Cost', 'YoY Trend', 'Severity'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chronicConditions.map(c => (
              <tr key={c.condition} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{c.condition}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.members.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(c.avgCost)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#ef4444', fontWeight: 600 }}>{c.trend}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                    background: c.severity === 'high' ? '#fee2e2' : c.severity === 'moderate' ? '#fef3c7' : '#dcfce7',
                    color: c.severity === 'high' ? '#991b1b' : c.severity === 'moderate' ? '#92400e' : '#166534',
                  }}>{c.severity.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="High-Cost Claimant Distribution">
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            5% of members account for 60% of all medical and pharmacy spend. Between 2020-2023, $1M+ claimants increased by 50%.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Claim Tier', 'Claimants', 'Total Spend', '% of Total'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {highCostClaimantTiers.map(t => (
                <tr key={t.tier} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{t.tier}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{t.count}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(t.totalSpend)}</td>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>{((t.totalSpend / totalHCCSpend) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: 10, background: '#f6f1f9', borderRadius: 8, fontSize: 12, color: '#452d5a' }}>
            <strong>Total:</strong> {totalClaimants} high-cost claimants | {formatCurrency(totalHCCSpend)} total spend
          </div>
        </Card>

        <Card title="Emerging Clinical Conditions">
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            New and growing conditions that may significantly impact future costs. Monitor these for proactive mitigation.
          </p>
          {emergingConditions.map(e => (
            <div key={e.condition} style={{ padding: 12, marginBottom: 8, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #8d5ead' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{e.condition}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                  background: e.pepmIncrease === 'Emerging' ? '#e8d5f5' : '#fee2e2',
                  color: e.pepmIncrease === 'Emerging' ? '#452d5a' : '#991b1b',
                }}>{e.pepmIncrease} PEPM</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{e.note}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 10, background: '#fef3c7', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
            <strong>Pipeline Alert:</strong> Gene and cell therapy treatments for complex conditions are entering the market. Multi-million-dollar treatments expected over the next few years.
          </div>
        </Card>
      </div>

      <Card title="External Cost Factors">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { title: 'Health System Consolidation', impact: 'High', description: 'Provider consolidation continues to drive negotiated rate increases across markets.' },
            { title: 'Tariff & Supply Chain', impact: 'Moderate', description: 'Medical devices, durable equipment and pharma components face supply chain disruptions from tariff policy changes.' },
            { title: 'General Inflation', impact: 'Moderate', description: 'Health systems operating on thin margins pass anticipated cost increases to plan sponsors.' },
          ].map(f => (
            <div key={f.title} style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#452d5a' }}>{f.title}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                  background: f.impact === 'High' ? '#fee2e2' : '#fef3c7',
                  color: f.impact === 'High' ? '#991b1b' : '#92400e',
                }}>{f.impact}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{f.description}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
