import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  ClipboardCheck,
  BarChart3,
  HeartPulse,
  Brain,
  CircleDollarSign,
  Package,
} from 'lucide-react';
import parameanLogo from '../../assets/paramean-logo.svg';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/plan-sponsors', label: 'Plan Sponsors', icon: Users },
  { path: '/quotes', label: 'Quotes', icon: FileText },
  { path: '/underwriting', label: 'Underwriting', icon: ClipboardCheck },
  { path: '/policies', label: 'Policies', icon: Shield },
  { path: '/cost-drivers', label: 'Cost Drivers', icon: HeartPulse },
  { path: '/high-cost-claimants', label: 'High-Cost Claims', icon: CircleDollarSign },
  { path: '/claims-insights', label: 'Claims Insights', icon: Brain },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside
        style={{
          width: 240,
          background: '#452d5a',
          color: '#e2e8f0',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <img src={parameanLogo} alt="Paramean Solutions" style={{ width: 180, marginBottom: 12 }} />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
            Bammo Shield
          </h1>
          <p style={{ fontSize: 11, color: '#c7a5dc', margin: '4px 0 0' }}>
            Reinsurance & Capital Risk
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
                  color: isActive ? '#fff' : '#c7a5dc',
                  background: isActive ? '#5a3a76' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  borderLeft: isActive ? '3px solid #8d5ead' : '3px solid transparent',
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
