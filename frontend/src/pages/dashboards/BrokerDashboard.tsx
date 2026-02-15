import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import MetricCard from '../../components/common/MetricCard';
import Card from '../../components/common/Card';
import InsightsBar from '../../components/common/InsightsBar';
import { Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#6f4891', '#0d9488', '#8d5ead', '#f59e0b', '#ef4444'];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const clientPortfolio = [
  { client: 'Pacific Health ACO', members: 4500, premium: 1420000, renewalDate: '2027-02-28', status: 'active', coverageType: 'Both', riskScore: 42 },
  { client: 'Midwest Provider Network', members: 2200, premium: 840000, renewalDate: '2026-12-31', status: 'active', coverageType: 'Specific', riskScore: 55 },
  { client: 'Southeast TPA Solutions', members: 8100, premium: 2180000, renewalDate: '2027-01-31', status: 'active', coverageType: 'Aggregate', riskScore: 38 },
  { client: 'Northeast ACO Partners', members: 3200, premium: 980000, renewalDate: '2026-06-30', status: 'renewal_due', coverageType: 'Both', riskScore: 48 },
  { client: 'Gulf Coast Health Group', members: 1800, premium: 620000, renewalDate: '2026-08-15', status: 'renewal_due', coverageType: 'Specific', riskScore: 61 },
];

const placementPipeline = [
  { stage: 'Prospect', count: 8, value: 2400000 },
  { stage: 'RFP Sent', count: 5, value: 1850000 },
  { stage: 'Quote Generated', count: 4, value: 1620000 },
  { stage: 'Under Review', count: 3, value: 1100000 },
  { stage: 'Approved', count: 2, value: 890000 },
  { stage: 'Bound', count: 1, value: 420000 },
];

const commissionTrend = [
  { month: 'Sep', commission: 42000, newBusiness: 15000, renewal: 27000 },
  { month: 'Oct', commission: 48000, newBusiness: 22000, renewal: 26000 },
  { month: 'Nov', commission: 45000, newBusiness: 12000, renewal: 33000 },
  { month: 'Dec', commission: 52000, newBusiness: 18000, renewal: 34000 },
  { month: 'Jan', commission: 56000, newBusiness: 25000, renewal: 31000 },
  { month: 'Feb', commission: 61000, newBusiness: 28000, renewal: 33000 },
];

const productMix = [
  { name: 'Specific Stop Loss', value: 35 },
  { name: 'Aggregate Stop Loss', value: 20 },
  { name: 'Both (Spec+Agg)', value: 25 },
  { name: 'Quota Share', value: 12 },
  { name: 'Surety Bonds', value: 8 },
];

const upcomingRenewals = [
  { client: 'Northeast ACO Partners', renewalDate: '06/30/2026', premium: 980000, daysOut: 135, action: 'Start RFP' },
  { client: 'Gulf Coast Health Group', renewalDate: '08/15/2026', premium: 620000, daysOut: 181, action: 'Schedule Review' },
  { client: 'Midwest Provider Network', renewalDate: '12/31/2026', premium: 840000, daysOut: 319, action: 'Monitor' },
];

export default function BrokerDashboard() {
  const navigate = useNavigate();
  const totalPremium = clientPortfolio.reduce((s, c) => s + c.premium, 0);
  const totalMembers = clientPortfolio.reduce((s, c) => s + c.members, 0);
  const totalCommission = commissionTrend.reduce((s, m) => s + m.commission, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Broker Dashboard
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Client portfolio, placement pipeline, commissions, and renewal management.
      </p>

      <InsightsBar />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Client Accounts" value={clientPortfolio.length} icon={<Users size={22} />} trend={`${totalMembers.toLocaleString()} total members`} />
        <MetricCard label="Book Premium" value={formatCurrency(totalPremium)} icon={<DollarSign size={22} />} trend="Annual in-force" />
        <MetricCard label="Pipeline Value" value={formatCurrency(placementPipeline.reduce((s, p) => s + p.value, 0))} icon={<TrendingUp size={22} />} trend={`${placementPipeline.reduce((s, p) => s + p.count, 0)} opportunities`} />
        <MetricCard label="YTD Commissions" value={formatCurrency(totalCommission)} icon={<CheckCircle size={22} />} trend="+22% vs prior year" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Placement Pipeline">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={placementPipeline} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Premium Value">
                {placementPipeline.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Product Mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={productMix} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={3} dataKey="value">
                {productMix.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Commission Trend">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={commissionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Legend />
              <Bar dataKey="newBusiness" fill="#0d9488" name="New Business" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="renewal" fill="#6f4891" name="Renewal" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Upcoming Renewals">
          {upcomingRenewals.map(r => (
            <div key={r.client} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <Clock size={16} color={r.daysOut < 150 ? '#ef4444' : r.daysOut < 200 ? '#f59e0b' : '#64748b'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#452d5a' }}>{r.client}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{r.renewalDate} | {formatCurrency(r.premium)} | {r.daysOut} days</div>
              </div>
              <button
                onClick={() => navigate('/quotes')}
                style={{
                  padding: '4px 12px', fontSize: 11, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer',
                  background: r.daysOut < 150 ? '#fee2e2' : r.daysOut < 200 ? '#fef3c7' : '#f1f5f9',
                  color: r.daysOut < 150 ? '#991b1b' : r.daysOut < 200 ? '#92400e' : '#64748b',
                }}
              >
                {r.action}
              </button>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Client Portfolio">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Client', 'Members', 'Annual Premium', 'Coverage', 'Risk Score', 'Renewal', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientPortfolio.map(c => (
              <tr key={c.client} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => navigate('/plan-sponsors')}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: '#452d5a' }}>{c.client}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.members.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{formatCurrency(c.premium)}</td>
                <td style={{ padding: '10px 12px', fontSize: 12 }}>{c.coverageType}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 40, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                      <div style={{ width: `${c.riskScore}%`, height: '100%', borderRadius: 3, background: c.riskScore > 55 ? '#ef4444' : c.riskScore > 45 ? '#f59e0b' : '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{c.riskScore}%</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12 }}>{new Date(c.renewalDate).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                    background: c.status === 'active' ? '#dcfce7' : '#fef3c7',
                    color: c.status === 'active' ? '#166534' : '#92400e',
                  }}>{c.status === 'active' ? 'ACTIVE' : 'RENEWAL DUE'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
