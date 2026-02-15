import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { DollarSign, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import type { DashboardMetrics } from '../types';
import { analyticsApi } from '../api/services';

const COLORS = ['#6f4891', '#8d5ead', '#0d9488', '#f59e0b', '#ef4444'];

const mockMetrics: DashboardMetrics = {
  totalGroups: 24,
  totalActiveQuotes: 18,
  totalActivePolicies: 14,
  totalPremiumInForce: 5830000,
  totalExpectedClaims: 4285000,
  averageRiskScore: 0.44,
  averagePepmRate: 298.35,
  quotesByStatus: { draft: 4, pending_review: 3, approved: 5, declined: 2, bound: 4 },
  policiesByStatus: { active: 14, pending: 3, expired: 5, cancelled: 2 },
  coverageBreakdown: { specific: 5, aggregate: 3, both: 6, quota_share: 2, surety_bond: 4 },
  riskDistribution: { low: 9, moderate: 8, high: 5, very_high: 2 },
  premiumTrend: [
    { month: 'Mar 2025', premium: 310000 },
    { month: 'Apr 2025', premium: 325000 },
    { month: 'May 2025', premium: 348000 },
    { month: 'Jun 2025', premium: 362000 },
    { month: 'Jul 2025', premium: 385000 },
    { month: 'Aug 2025', premium: 401000 },
    { month: 'Sep 2025', premium: 418000 },
    { month: 'Oct 2025', premium: 442000 },
    { month: 'Nov 2025', premium: 465000 },
    { month: 'Dec 2025', premium: 488000 },
    { month: 'Jan 2026', premium: 512000 },
    { month: 'Feb 2026', premium: 533000 },
  ],
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);

  useEffect(() => {
    analyticsApi.dashboard().then(setMetrics).catch(() => {});
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const lossRatio = metrics.totalPremiumInForce > 0
    ? (metrics.totalExpectedClaims / metrics.totalPremiumInForce * 100).toFixed(1) + '%'
    : '-';

  const coverageLabels: Record<string, string> = {
    specific: 'Specific Stop Loss', aggregate: 'Aggregate Stop Loss', both: 'Both (Spec+Agg)',
    quota_share: 'Quota Share', surety_bond: 'Surety Bonds',
  };
  const coverageData = Object.entries(metrics.coverageBreakdown).map(([name, value]) => ({
    name: coverageLabels[name] || name.toUpperCase(),
    value,
  }));

  const riskData = Object.entries(metrics.riskDistribution).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    count: value,
  }));

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Analytics & Reporting
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Premium In-Force" value={formatCurrency(metrics.totalPremiumInForce)} icon={<DollarSign size={22} />} />
        <MetricCard label="Expected Claims" value={formatCurrency(metrics.totalExpectedClaims)} icon={<TrendingUp size={22} />} />
        <MetricCard label="Expected Loss Ratio" value={lossRatio} icon={<AlertTriangle size={22} />} />
        <MetricCard label="Active Policies" value={metrics.totalActivePolicies} icon={<Shield size={22} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Coverage Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={coverageData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {coverageData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risk Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {riskData.map((_entry, index) => (
                  <Cell key={index} fill={['#22c55e', '#eab308', '#f97316', '#ef4444'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {metrics.premiumTrend.length > 0 && (
        <Card title="Premium Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.premiumTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Line type="monotone" dataKey="premium" stroke="#6f4891" strokeWidth={2} dot={{ fill: '#6f4891' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
