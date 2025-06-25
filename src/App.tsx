import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { OrganizationProvider } from '@/contexts/OrganizationProvider';

// Layout Components
import { AppLayout } from '@/components/Layout/AppLayout';
import { AuthLayout } from '@/components/Layout/AuthLayout';

// Auth Components  
import RequireAuth from '@/components/Auth/RequireAuth';
import RequireAdmin from '@/components/Auth/RequireAdmin';
import { RequireSettleBillEnabled } from '@/components/Auth/RequireSettleBillEnabled';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Landing from '@/pages/Landing';
import Requests from '@/pages/Requests';
import PublicShows from '@/pages/PublicShows';
import PublicUniverses from '@/pages/PublicUniverses';
import PublicShowDetail from '@/pages/PublicShowDetail';
import PublicUniverseDetail from '@/pages/PublicUniverseDetail';

// Finance App Pages
import FinanceDashboard from '@/apps/finance/pages/Dashboard';
import Transactions from '@/apps/finance/pages/Transactions';
import Categories from '@/apps/finance/pages/Categories';
import CategoryDetail from '@/apps/finance/pages/CategoryDetail';
import Wallets from '@/apps/finance/pages/Wallets';
import WalletDetail from '@/apps/finance/pages/WalletDetail';
import Budgets from '@/apps/finance/pages/Budgets';
import Companies from '@/apps/finance/pages/Companies';
import Credits from '@/apps/finance/pages/Credits';
import Transfers from '@/apps/finance/pages/Transfers';
import FinanceReports from '@/apps/finance/pages/Reports';
import FinanceSettings from '@/apps/finance/pages/Settings';

// TV Shows App Pages
import TVShowsDashboard from '@/apps/tv-shows/pages/Dashboard';
import MyShows from '@/apps/tv-shows/pages/MyShows';
import ShowDetail from '@/apps/tv-shows/pages/ShowDetail';
import Universes from '@/apps/tv-shows/pages/Universes';
import UniverseDetail from '@/apps/tv-shows/pages/UniverseDetail';
import UniverseDashboard from '@/apps/tv-shows/pages/UniverseDashboard';
import PrivateUniverses from '@/apps/tv-shows/pages/PrivateUniverses';
import PublicTVShows from '@/apps/tv-shows/pages/PublicShows';
import PublicTVUniverses from '@/apps/tv-shows/pages/PublicUniverses';

// Movies App
import MoviesApp from '@/apps/movies/src/pages/MoviesApp';

// SettleBill App
import { SettleBillApp } from '@/apps/settlebill/src/pages/SettleBillApp';
import { OverviewPage } from '@/apps/settlebill/src/pages/OverviewPage';
import { NetworksPage } from '@/apps/settlebill/src/pages/NetworksPage';
import { CreateNetworkPage } from '@/apps/settlebill/src/pages/CreateNetworkPage';
import { NetworkDetailPage } from '@/apps/settlebill/src/pages/NetworkDetailPage';
import { BillsPage } from '@/apps/settlebill/src/pages/BillsPage';
import { CreateBillPage } from '@/apps/settlebill/src/pages/CreateBillPage';
import { BillDetailPage } from '@/apps/settlebill/src/pages/BillDetailPage';
import { BillEditPage } from '@/apps/settlebill/src/pages/BillEditPage';
import { SimplifyPage } from '@/apps/settlebill/src/pages/SimplifyPage';
import { SettleBillSettingsPage } from '@/apps/settlebill/src/pages/SettingsPage';

// Admin Pages
import AdminDashboard from '@/apps/admin/pages/Dashboard';
import AdminUsers from '@/apps/admin/pages/Users';
import AdminContent from '@/apps/admin/pages/Content';
import AdminAddShow from '@/pages/admin/AdminAddShow';
import AdminMovieImport from '@/pages/AdminMovieImport';

// Legal Pages
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Sitemap from '@/pages/Sitemap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OrganizationProvider>
            <Router>
              <div className="min-h-screen bg-background">
                {/* Landing Page */}
                <Routes>
                  <Route path="/landing" element={<Landing />} />
                  
                  {/* Legal Pages */}
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/sitemap" element={<Sitemap />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={
                    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
                      <Login />
                    </AuthLayout>
                  } />
                  <Route path="/signup" element={
                    <AuthLayout title="Create account" subtitle="Get started with your new account">
                      <SignUp />
                    </AuthLayout>
                  } />

                  {/* Public Routes that don't require auth */}
                  <Route path="/public/shows" element={
                    <AppLayout>
                      <PublicShows />
                    </AppLayout>
                  } />
                  <Route path="/public/shows/:slug" element={
                    <AppLayout>
                      <PublicShowDetail />
                    </AppLayout>
                  } />
                  <Route path="/public/universes" element={
                    <AppLayout>
                      <PublicUniverses />
                    </AppLayout>
                  } />
                  <Route path="/public/universes/:slug" element={
                    <AppLayout>
                      <PublicUniverseDetail />
                    </AppLayout>
                  } />

                  {/* Protected Routes */}
                  <Route path="/" element={
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  } />
                  
                  <Route path="/profile" element={
                    <RequireAuth>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  
                  <Route path="/settings" element={
                    <RequireAuth>
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    </RequireAuth>
                  } />

                  <Route path="/requests" element={
                    <RequireAuth>
                      <AppLayout>
                        <Requests />
                      </AppLayout>
                    </RequireAuth>
                  } />

                  {/* Finance App Routes */}
                  <Route path="/finance" element={
                    <RequireAuth>
                      <AppLayout>
                        <FinanceDashboard />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/transactions" element={
                    <RequireAuth>
                      <AppLayout>
                        <Transactions />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/categories" element={
                    <RequireAuth>
                      <AppLayout>
                        <Categories />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/categories/:id" element={
                    <RequireAuth>
                      <AppLayout>
                        <CategoryDetail />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/wallets" element={
                    <RequireAuth>
                      <AppLayout>
                        <Wallets />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/wallets/:id" element={
                    <RequireAuth>
                      <AppLayout>
                        <WalletDetail />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/budgets" element={
                    <RequireAuth>
                      <AppLayout>
                        <Budgets />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/companies" element={
                    <RequireAuth>
                      <AppLayout>
                        <Companies />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/credits" element={
                    <RequireAuth>
                      <AppLayout>
                        <Credits />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/transfers" element={
                    <RequireAuth>
                      <AppLayout>
                        <Transfers />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/reports" element={
                    <RequireAuth>
                      <AppLayout>
                        <FinanceReports />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/finance/settings" element={
                    <RequireAuth>
                      <AppLayout>
                        <FinanceSettings />
                      </AppLayout>
                    </RequireAuth>
                  } />

                  {/* TV Shows App Routes */}
                  <Route path="/tv-shows" element={
                    <RequireAuth>
                      <AppLayout>
                        <TVShowsDashboard />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/my-shows" element={
                    <RequireAuth>
                      <AppLayout>
                        <MyShows />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/shows/:id" element={
                    <RequireAuth>
                      <AppLayout>
                        <ShowDetail />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/universes" element={
                    <RequireAuth>
                      <AppLayout>
                        <PrivateUniverses />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/universes/:id" element={
                    <RequireAuth>
                      <AppLayout>
                        <UniverseDetail />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/universes/:id/dashboard" element={
                    <RequireAuth>
                      <AppLayout>
                        <UniverseDashboard />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/public" element={
                    <RequireAuth>
                      <AppLayout>
                        <PublicTVShows />
                      </AppLayout>
                    </RequireAuth>
                  } />
                  <Route path="/tv-shows/public/universes" element={
                    <RequireAuth>
                      <AppLayout>
                        <PublicTVUniverses />
                      </AppLayout>
                    </RequireAuth>
                  } />

                  {/* Movies App Routes */}
                  <Route path="/movies" element={
                    <RequireAuth>
                      <AppLayout>
                        <MoviesApp />
                      </AppLayout>
                    </RequireAuth>
                  } />

                  {/* SettleBill App Routes */}
                  <Route path="/settlebill" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <OverviewPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/networks" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <NetworksPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/networks/create" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <CreateNetworkPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/networks/:id" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <NetworkDetailPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/bills" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <BillsPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/bills/create" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <CreateBillPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/bills/:id" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <BillDetailPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/bills/:id/edit" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <BillEditPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/simplify" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <SimplifyPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />
                  <Route path="/settlebill/settings" element={
                    <RequireAuth>
                      <RequireSettleBillEnabled>
                        <AppLayout>
                          <SettleBillSettingsPage />
                        </AppLayout>
                      </RequireSettleBillEnabled>
                    </RequireAuth>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AppLayout>
                          <AdminDashboard />
                        </AppLayout>
                      </RequireAdmin>
                    </RequireAuth>
                  } />
                  <Route path="/admin/users" element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AppLayout>
                          <AdminUsers />
                        </AppLayout>
                      </RequireAdmin>
                    </RequireAuth>
                  } />
                  <Route path="/admin/content" element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AppLayout>
                          <AdminContent />
                        </AppLayout>
                      </RequireAdmin>
                    </RequireAuth>
                  } />
                  <Route path="/admin/add-show" element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AppLayout>
                          <AdminAddShow />
                        </AppLayout>
                      </RequireAdmin>
                    </RequireAuth>
                  } />
                  <Route path="/admin/movie-import" element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AppLayout>
                          <AdminMovieImport />
                        </AppLayout>
                      </RequireAdmin>
                    </RequireAuth>
                  } />

                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </OrganizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
