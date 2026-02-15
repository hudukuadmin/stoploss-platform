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
  FileSearch,
  Gem,
  FileBarChart,
  Building2,
  Handshake,
  RefreshCw,
  ClipboardList,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import parameanLogo from '../../assets/paramean-logo.svg';
import { usePersona, type Persona } from '../../context/PersonaContext';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const providerNav: NavSection[] = [
  {
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/products', label: 'Products', icon: Package },
    ],
  },
  {
    title: 'Coverage',
    items: [
      { path: '/quotes', label: 'Quotes', icon: FileText },
      { path: '/policies', label: 'Policies', icon: Shield },
      { path: '/eob-repository', label: 'EOB Repository', icon: FileSearch },
      { path: '/claims-repository', label: 'Claims Repository', icon: ClipboardList },
      { path: '/reconciliation', label: 'Reconciliation', icon: RefreshCw },
      { path: '/reinsurance-reporting', label: 'Reinsurance Reporting', icon: TrendingUp },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/value-analytics', label: 'Value Analytics', icon: Gem },
      { path: '/reporting-analytics', label: 'Reporting Analytics', icon: FileBarChart },
    ],
  },
  {
    title: 'Risk Intelligence',
    items: [
      { path: '/cost-drivers', label: 'Cost Drivers', icon: HeartPulse },
      { path: '/high-cost-claimants', label: 'High-Cost Claims', icon: CircleDollarSign },
      { path: '/claims-insights', label: 'Claims Insights', icon: Brain },
    ],
  },
];

const reinsurerNav: NavSection[] = [
  {
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/products', label: 'Products', icon: Package },
    ],
  },
  {
    title: 'Book Management',
    items: [
      { path: '/quotes', label: 'Quotes', icon: FileText },
      { path: '/underwriting', label: 'Underwriting', icon: ClipboardCheck },
      { path: '/policies', label: 'Policies', icon: Shield },
      { path: '/eob-repository', label: 'EOB Repository', icon: FileSearch },
      { path: '/claims-repository', label: 'Claims Repository', icon: ClipboardList },
      { path: '/reconciliation', label: 'Reconciliation', icon: RefreshCw },
      { path: '/reinsurance-reporting', label: 'Reinsurance Reporting', icon: TrendingUp },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { path: '/analytics', label: 'Portfolio Analytics', icon: BarChart3 },
      { path: '/claims-insights', label: 'Claims Insights', icon: Brain },
      { path: '/cost-drivers', label: 'Cost Drivers', icon: HeartPulse },
      { path: '/high-cost-claimants', label: 'High-Cost Claims', icon: CircleDollarSign },
    ],
  },
];

const brokerNav: NavSection[] = [
  {
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/products', label: 'Products', icon: Package },
      { path: '/plan-sponsors', label: 'Plan Sponsors', icon: Users },
    ],
  },
  {
    title: 'Placement',
    items: [
      { path: '/quotes', label: 'Quotes', icon: FileText },
      { path: '/policies', label: 'Policies', icon: Shield },
      { path: '/eob-repository', label: 'EOB Repository', icon: FileSearch },
      { path: '/claims-repository', label: 'Claims Repository', icon: ClipboardList },
      { path: '/reconciliation', label: 'Reconciliation', icon: RefreshCw },
      { path: '/reinsurance-reporting', label: 'Reinsurance Reporting', icon: TrendingUp },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/cost-drivers', label: 'Cost Drivers', icon: HeartPulse },
      { path: '/claims-insights', label: 'Claims Insights', icon: Brain },
    ],
  },
];

const navByPersona: Record<Persona, NavSection[]> = {
  provider: providerNav,
  reinsurer: reinsurerNav,
  broker: brokerNav,
};

const personaConfig: Record<Persona, { label: string; icon: LucideIcon; color: string }> = {
  provider: { label: 'Provider', icon: Building2, color: '#0d9488' },
  broker: { label: 'Broker', icon: Handshake, color: '#f59e0b' },
  reinsurer: { label: 'Re-insurer', icon: Shield, color: '#6f4891' },
};

export default function Layout() {
  const location = useLocation();
  const { persona, setPersona } = usePersona();
  const sections = navByPersona[persona];

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
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <img src={parameanLogo} alt="Paramean Solutions" style={{ width: 180, marginBottom: 12 }} />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
            Bammo Shield
          </h1>
          <p style={{ fontSize: 11, color: '#c7a5dc', margin: '4px 0 0' }}>
            Reinsurance & Capital Risk
          </p>
        </div>

        <div style={{ padding: '0 12px', marginBottom: 20 }}>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #5a3a76' }}>
            {(['provider', 'broker', 'reinsurer'] as Persona[]).map(p => {
              const cfg = personaConfig[p];
              const isActive = persona === p;
              return (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  style={{
                    flex: 1, padding: '6px 4px', border: 'none', cursor: 'pointer',
                    background: isActive ? cfg.color : 'transparent',
                    color: isActive ? '#fff' : '#c7a5dc',
                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    transition: 'background 0.2s',
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <div style={{ padding: '12px 20px 4px', fontSize: 10, fontWeight: 600, color: '#8d5ead', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {section.title}
                </div>
              )}
              {section.items.map(({ path, label, icon: Icon }) => {
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
                      padding: '9px 20px',
                      color: isActive ? '#fff' : '#c7a5dc',
                      background: isActive ? '#5a3a76' : 'transparent',
                      textDecoration: 'none',
                      fontSize: 13,
                      borderLeft: isActive ? '3px solid #8d5ead' : '3px solid transparent',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
