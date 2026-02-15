import { useNavigate } from 'react-router-dom';
import { RefreshCw, ClipboardList, FileSearch, TrendingUp } from 'lucide-react';

const insights = [
  { path: '/reconciliation', label: 'Reconciliation Status', description: 'View Reconciliation Status', icon: RefreshCw },
  { path: '/claims-repository', label: 'Claims Repository', description: 'Manage All Submitted Claims', icon: ClipboardList },
  { path: '/eob-repository', label: 'EOB Repository', description: 'Manage All EOBs', icon: FileSearch },
  { path: '/reinsurance-reporting', label: 'Reinsurance Reporting', description: 'View Reinsurance Reporting', icon: TrendingUp },
];

export default function InsightsBar() {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#334155' }}>Insights</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {insights.map((item, i) => {
          const Icon = item.icon;
          const isFirst = i === 0;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', borderRadius: 12, cursor: 'pointer',
                background: isFirst ? '#6f4891' : '#fff',
                color: isFirst ? '#fff' : '#334155',
                border: isFirst ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{item.description}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFirst ? 'rgba(255,255,255,0.2)' : '#f6f1f9',
              }}>
                <Icon size={18} color={isFirst ? '#fff' : '#6f4891'} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
