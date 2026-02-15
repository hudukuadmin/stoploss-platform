import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/quotes', label: 'Quotes', icon: FileText },
  { path: '/underwriting', label: 'Underwriting', icon: ClipboardCheck },
  { path: '/policies', label: 'Policies', icon: Shield },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside
        style={{
          width: 240,
          background: '#1e293b',
          color: '#e2e8f0',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
            StopLoss Pro
          </h1>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>
            Value-Based Care Insurance
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path ||
              (path !== '/' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? '#334155' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
