import { usePersona } from '../context/PersonaContext';
import ProviderDashboard from './dashboards/ProviderDashboard';
import BrokerDashboard from './dashboards/BrokerDashboard';
import ReinsurerDashboard from './dashboards/ReinsurerDashboard';

export default function DashboardPage() {
  const { persona } = usePersona();

  switch (persona) {
    case 'provider':
      return <ProviderDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    case 'reinsurer':
      return <ReinsurerDashboard />;
  }
}
