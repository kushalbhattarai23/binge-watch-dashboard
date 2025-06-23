import React, { useState } from 'react';
import AppSelector from '@/components/AppSelector';
import MoviesApp from '@/apps/movies/src/pages/MoviesApp';
import { SettleBillApp } from '@/apps/settlebill/src/pages/SettleBillApp';
import FinanceDashboard from '@/apps/finance/pages/Dashboard';
import TvShowsDashboard from '@/apps/tv-shows/pages/Dashboard';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tv, DollarSign, Film, Receipt, LogIn, UserPlus, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleAppSelect = (appId: string) => {
    if (!user && (appId === 'movies' || appId === 'finance' || appId === 'settlegara' || appId === 'settlebill' || appId === 'tv-shows')) {
      // Redirect to login if not authenticated
      return;
    }
    setSelectedApp(appId);
  };

  const renderApp = () => {
    switch (selectedApp) {
      case 'movies':
        return user ? <MoviesApp /> : null;
      case 'settlegara':
        return user ? <SettleGaraApp /> : null;
      case 'settlebill':
        return user ? <SettleBillApp /> : null;
      case 'finance':
        return user ? <FinanceDashboard /> : null;
      case 'tv-shows':
        return user ? <TvShowsDashboard /> : null;
      default:
        return <AppSelector onAppSelect={handleAppSelect} />;
    }
  };

  const renderHomeContent = () => {
    if (selectedApp) {
      return renderApp();
    }

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TrackerHub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal dashboard for tracking TV shows, managing finances, organizing movies, and splitting bills with friends.
          </p>
        </div>

        {!user && (
          <div className="max-w-md mx-auto space-y-4">
            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Get Started</CardTitle>
                <CardDescription>
                  Sign in to access all your apps and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-2 border-purple-200 hover:bg-purple-50" size="lg">
                  <Link to="/signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <AppSelector onAppSelect={handleAppSelect} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          <Card className="border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Tv className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">TV Shows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Track your favorite shows, manage watchlists, and organize by universes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Finance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Manage wallets, track expenses, and gain insights into your spending.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Movies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Track your movie watchlist, ratings, and discover new films.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:border-orange-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Receipt className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">SettleGara</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Split bills and settle expenses with friends and groups.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 hover:border-teal-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calculator className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg">SettleBill</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Manage bills and split expenses with networks and groups.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>TrackerHub – Your Personal Dashboard</title>
        <meta name="description" content="Track TV shows, manage finances, organize movies, and split bills all in one place." />
      </Helmet>
      <div className="min-h-screen p-6">
        {renderHomeContent()}
      </div>
    </>
  );
};

export default Index;
