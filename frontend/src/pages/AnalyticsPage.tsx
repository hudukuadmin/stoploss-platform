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

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

const defaultMetrics: DashboardMetrics = {
  totalGroups: 0, totalActiveQuotes: 0, totalActivePolicies: 0,
  totalPremiumInForce: 0, totalExpectedClaims: 0, averageRiskScore: 0,
  averagePepmRate: 0, quotesByStatus: {}, policiesByStatus: {},
  coverageBreakdown: {}, riskDistribution: { low: 0, moderate: 0, high: 0, very_high: 0 },
  premiumTrend: [],
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);

  useEffect(() => {
    analyticsApi.dashboard().then(setMetrics).catch(() => {});
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const lossRatio = metrics.totalPremiumInForce > 0
    ? (metrics.totalExpectedClaims / metrics.totalPremiumInForce * 100).toFixed(1) + '%'
    : '-';

  const coverageData = Object.entries(metrics.coverageBreakdown).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
  }));

  const riskData = Object.entries(metrics.riskDistribution).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    count: value,
  }));

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
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
              <Line type="monotone" dataKey="premium" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
