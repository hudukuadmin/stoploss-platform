import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonaProvider } from './context/PersonaContext';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import GroupsPage from './pages/GroupsPage';
import QuotesPage from './pages/QuotesPage';
import UnderwritingPage from './pages/UnderwritingPage';
import PoliciesPage from './pages/PoliciesPage';
import EOBRepositoryPage from './pages/EOBRepositoryPage';
import CostDriversPage from './pages/CostDriversPage';
import ClaimsInsightsPage from './pages/ClaimsInsightsPage';
import HighCostClaimantsPage from './pages/HighCostClaimantsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ValueAnalyticsPage from './pages/provider/ValueAnalyticsPage';
import ReportingAnalyticsPage from './pages/provider/ReportingAnalyticsPage';
import ReconciliationPage from './pages/ReconciliationPage';
import ClaimsRepositoryPage from './pages/ClaimsRepositoryPage';
import ReinsuranceReportingPage from './pages/ReinsuranceReportingPage';

export default function App() {
  return (
    <PersonaProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/plan-sponsors" element={<GroupsPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/underwriting" element={<UnderwritingPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/eob-repository" element={<EOBRepositoryPage />} />
            <Route path="/cost-drivers" element={<CostDriversPage />} />
            <Route path="/high-cost-claimants" element={<HighCostClaimantsPage />} />
            <Route path="/claims-insights" element={<ClaimsInsightsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/value-analytics" element={<ValueAnalyticsPage />} />
            <Route path="/reporting-analytics" element={<ReportingAnalyticsPage />} />
            <Route path="/reconciliation" element={<ReconciliationPage />} />
            <Route path="/claims-repository" element={<ClaimsRepositoryPage />} />
            <Route path="/reinsurance-reporting" element={<ReinsuranceReportingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PersonaProvider>
  );
}
