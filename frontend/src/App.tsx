import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import GroupsPage from './pages/GroupsPage';
import QuotesPage from './pages/QuotesPage';
import UnderwritingPage from './pages/UnderwritingPage';
import PoliciesPage from './pages/PoliciesPage';
import CostDriversPage from './pages/CostDriversPage';
import ClaimsInsightsPage from './pages/ClaimsInsightsPage';
import HighCostClaimantsPage from './pages/HighCostClaimantsPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/plan-sponsors" element={<GroupsPage />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/underwriting" element={<UnderwritingPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/cost-drivers" element={<CostDriversPage />} />
          <Route path="/high-cost-claimants" element={<HighCostClaimantsPage />} />
          <Route path="/claims-insights" element={<ClaimsInsightsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
