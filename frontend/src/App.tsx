import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import QuotesPage from './pages/QuotesPage';
import UnderwritingPage from './pages/UnderwritingPage';
import PoliciesPage from './pages/PoliciesPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/underwriting" element={<UnderwritingPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
