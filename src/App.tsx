
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { AppLayout } from '@/components/Layout/AppLayout';
import AuthLayout from '@/components/Layout/AuthLayout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Landing from '@/pages/Landing';
import Requests from '@/pages/Requests';
import PublicShows from '@/pages/PublicShows';
import PublicShowDetail from '@/pages/PublicShowDetail';
import PublicUniverses from '@/pages/PublicUniverses';
import PublicUniverseDetail from '@/pages/PublicUniverseDetail';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Sitemap from '@/pages/Sitemap';

// Finance App
import FinanceDashboard from '@/apps/finance/pages/Dashboard';
import FinanceTransactions from '@/apps/finance/pages/Transactions';
import FinanceWallets from '@/apps/finance/pages/Wallets';
import FinanceWalletDetail from '@/apps/finance/pages/WalletDetail';
import FinanceCategories from '@/apps/finance/pages/Categories';
import FinanceCategoryDetail from '@/apps/finance/pages/CategoryDetail';
import FinanceTransfers from '@/apps/finance/pages/Transfers';
import FinanceBudgets from '@/apps/finance/pages/Budgets';
import FinanceReports from '@/apps/finance/pages/Reports';
import FinanceSettings from '@/apps/finance/pages/Settings';
import FinanceCredits from '@/apps/finance/pages/Credits';

// TV Shows App
import TvShowsDashboard from '@/apps/tv-shows/pages/Dashboard';
import MyShows from '@/apps/tv-shows/pages/MyShows';
import PublicShowsPage from '@/apps/tv-shows/pages/PublicShows';
import PublicUniversesPage from '@/apps/tv-shows/pages/PublicUniverses';
import PrivateUniverses from '@/apps/tv-shows/pages/PrivateUniverses';
import ShowDetail from '@/apps/tv-shows/pages/ShowDetail';
import Universes from '@/apps/tv-shows/pages/Universes';
import UniverseDetail from '@/apps/tv-shows/pages/UniverseDetail';
import UniverseDashboard from '@/apps/tv-shows/pages/UniverseDashboard';

// SettleBill App
import SettleBillApp from '@/apps/settlebill/src/pages/SettleBillApp';

// Movies App  
import MoviesApp from '@/apps/movies/src/pages/MoviesApp';

// Admin Pages
import AdminDashboard from '@/apps/admin/pages/Dashboard';
import AdminUsers from '@/apps/admin/pages/Users';
import AdminContent from '@/apps/admin/pages/Content';
import AdminAddShow from '@/pages/admin/AdminAddShow';
import AdminMovieImportPage from '@/pages/AdminMovieImport';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminSignUp from '@/pages/admin/AdminSignUp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OrganizationProvider>
          <Router>
            <Routes>
              {/* Auth routes outside of AppLayout */}
              <Route path="/admin/login" element={
                <AuthLayout title="Admin Access" subtitle="Sign in to the admin dashboard">
                  <AdminLogin />
                </AuthLayout>
              } />
              <Route path="/admin/signup" element={
                <AuthLayout title="Admin Registration" subtitle="Create your admin account">
                  <AdminSignUp />
                </AuthLayout>
              } />
              <Route path="/landing" element={<Landing />} />
              
              {/* All other routes use AppLayout */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="requests" element={<Requests />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="sitemap" element={<Sitemap />} />
                
                {/* Public routes */}
                <Route path="public/shows" element={<PublicShows />} />
                <Route path="public/shows/:slug" element={<PublicShowDetail />} />
                <Route path="public/show/:slug" element={<PublicShowDetail />} />
                <Route path="public/universes" element={<PublicUniverses />} />
                <Route path="public/universes/:slug" element={<PublicUniverseDetail />} />
                <Route path="public/universe/:slug" element={<PublicUniverseDetail />} />
                
                {/* Finance routes */}
                <Route path="finance" element={<FinanceDashboard />} />
                <Route path="finance/transactions" element={<FinanceTransactions />} />
                <Route path="finance/wallets" element={<FinanceWallets />} />
                <Route path="finance/wallets/:id" element={<FinanceWalletDetail />} />
                <Route path="finance/wallet/:id" element={<FinanceWalletDetail />} />
                <Route path="finance/categories" element={<FinanceCategories />} />
                <Route path="finance/categories/:id" element={<FinanceCategoryDetail />} />
                <Route path="finance/category/:id" element={<FinanceCategoryDetail />} />
                <Route path="finance/transfers" element={<FinanceTransfers />} />
                <Route path="finance/budgets" element={<FinanceBudgets />} />
                <Route path="finance/reports" element={<FinanceReports />} />
                <Route path="finance/settings" element={<FinanceSettings />} />
                <Route path="finance/credits" element={<FinanceCredits />} />
                
                {/* TV Shows routes */}
                <Route path="tv-shows" element={<TvShowsDashboard />} />
                <Route path="tv-shows/my-shows" element={<MyShows />} />
                <Route path="tv-shows/public-shows" element={<PublicShowsPage />} />
                <Route path="tv-shows/public-universes" element={<PublicUniversesPage />} />
                <Route path="tv-shows/private-universes" element={<PrivateUniverses />} />
                <Route path="tv-shows/show/:slug" element={<ShowDetail />} />
                <Route path="tv-shows/universes" element={<Universes />} />
                <Route path="tv-shows/universes/:slug" element={<UniverseDetail />} />
                <Route path="tv-shows/universe/:slug" element={<UniverseDetail />} />
                <Route path="tv-shows/universes/:slug/dashboard" element={<UniverseDashboard />} />

                {/* SettleBill routes - All handled by SettleBillApp */}
                <Route path="settlebill/*" element={<SettleBillApp />} />
                
                {/* Movies routes */}
                <Route path="movies/*" element={<MoviesApp />} />
                
                {/* Admin routes */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/content" element={<AdminContent />} />
                <Route path="admin/add-show" element={<AdminAddShow />} />
                <Route path="admin/add-movies" element={<AdminMovieImportPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </OrganizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
