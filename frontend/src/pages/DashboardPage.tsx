import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Shield,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import Card from '../components/common/Card';
import type { DashboardMetrics } from '../types';
import { analyticsApi } from '../api/services';

const RISK_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

const mockMetrics: DashboardMetrics = {
  totalGroups: 24,
  totalActiveQuotes: 18,
  totalActivePolicies: 12,
  totalPremiumInForce: 4850000,
  totalExpectedClaims: 3600000,
  averageRiskScore: 0.48,
  averagePepmRate: 285.50,
  quotesByStatus: { draft: 5, pending_review: 4, approved: 6, bound: 3 },
  policiesByStatus: { active: 12, pending: 2, expired: 1 },
  coverageBreakdown: { specific: 3, aggregate: 2, both: 7, quota_share: 2, surety_bond: 4 },
  riskDistribution: { low: 8, moderate: 10, high: 5, very_high: 1 },
  premiumTrend: [
    { month: 'Sep', premium: 320000 },
    { month: 'Oct', premium: 380000 },
    { month: 'Nov', premium: 410000 },
    { month: 'Dec', premium: 450000 },
    { month: 'Jan', premium: 485000 },
    { month: 'Feb', premium: 510000 },
  ],
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);

  useEffect(() => {
    analyticsApi.dashboard().then(setMetrics).catch(() => {});
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const riskData = Object.entries(metrics.riskDistribution).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value,
  }));

  const quoteStatusData = Object.entries(metrics.quotesByStatus).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    count: value,
  }));

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Dashboard
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Plan Sponsors" value={metrics.totalGroups} icon={<Users size={22} />} />
        <MetricCard label="Active Quotes" value={metrics.totalActiveQuotes} icon={<FileText size={22} />} />
        <MetricCard label="Active Policies" value={metrics.totalActivePolicies} icon={<Shield size={22} />} />
        <MetricCard
          label="Premium In-Force"
          value={formatCurrency(metrics.totalPremiumInForce)}
          icon={<DollarSign size={22} />}
        />
        <MetricCard
          label="Avg Risk Score"
          value={(metrics.averageRiskScore * 100).toFixed(1) + '%'}
          icon={<AlertTriangle size={22} />}
        />
        <MetricCard
          label="Avg PEPM Rate"
          value={formatCurrency(metrics.averagePepmRate)}
          icon={<TrendingUp size={22} />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Quote Activity">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={quoteStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6f4891" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risk Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {riskData.map((_entry, index) => (
                  <Cell key={index} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Premium Trend">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={metrics.premiumTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
            <Bar dataKey="premium" fill="#8d5ead" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
