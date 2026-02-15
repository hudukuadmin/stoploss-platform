import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
}

export default function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      {icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6',
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{value}</div>
        {trend && <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>{trend}</div>}
      </div>
    </div>
  );
}
