
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import { 
  Home, 
  Tv, 
  DollarSign, 
  Receipt, 
  Settings, 
  Globe,
  Building,
  PieChart,
  TrendingUp,
  CreditCard,
  ArrowUpDown,
  Target,
  Tag,
  Wallet,
  Film,
  Users,
  BarChart3,
  Calculator
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { settings } = useAppSettings();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const publicRoutes = [
    { name: 'Shows', href: '/public/shows', icon: Tv },
    { name: 'Universes', href: '/public/universes', icon: Globe },
  ];

  const tvShowsRoutes = user ? [
    { name: 'Dashboard', href: '/tv-shows', icon: BarChart3 },
    { name: 'My Shows', href: '/tv-shows/my-shows', icon: Tv },
    { name: 'Universes', href: '/tv-shows/universes', icon: Globe },
    { name: 'Public Shows', href: '/tv-shows/public', icon: Globe },
    { name: 'Public Universes', href: '/tv-shows/public/universes', icon: Globe },
  ] : [];

  const financeRoutes = user ? [
    { name: 'Dashboard', href: '/finance', icon: PieChart },
    { name: 'Transactions', href: '/finance/transactions', icon: ArrowUpDown },
    { name: 'Categories', href: '/finance/categories', icon: Tag },
    { name: 'Wallets', href: '/finance/wallets', icon: Wallet },
    { name: 'Budgets', href: '/finance/budgets', icon: Target },
    { name: 'Companies', href: '/finance/companies', icon: Building },
    { name: 'Credits', href: '/finance/credits', icon: CreditCard },
    { name: 'Transfers', href: '/finance/transfers', icon: TrendingUp },
    { name: 'Reports', href: '/finance/reports', icon: BarChart3 },
    { name: 'Settings', href: '/finance/settings', icon: Settings },
  ] : [];

  const movieRoutes = user ? [
    { name: 'My Movies', href: '/movies', icon: Film },
  ] : [];

  const settlebillRoutes = user ? [
    { name: 'Overview', href: '/settlebill', icon: Receipt },
    { name: 'Networks', href: '/settlebill/networks', icon: Users },
    { name: 'Bills', href: '/settlebill/bills', icon: Receipt },
    { name: 'Simplify', href: '/settlebill/simplify', icon: Calculator },
    { name: 'Settings', href: '/settlebill/settings', icon: Settings },
  ] : [];

  const adminRoutes = user && settings.enabledApps.admin ? [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Content', href: '/admin/content', icon: Settings },
  ] : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">T</span>
          </div>
          <span className="font-semibold text-lg">TrackerHub</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/') && location.pathname === '/'}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Public</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicRoutes.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && settings.enabledApps.tvShows && (
          <SidebarGroup>
            <SidebarGroupLabel>TV Shows</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tvShowsRoutes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user && settings.enabledApps.finance && (
          <SidebarGroup>
            <SidebarGroupLabel>Finance</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {financeRoutes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user && settings.enabledApps.movies && (
          <SidebarGroup>
            <SidebarGroupLabel>Movies</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {movieRoutes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user && settings.enabledApps.settlebill && (
          <SidebarGroup>
            <SidebarGroupLabel>SettleBill</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settlebillRoutes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {adminRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminRoutes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/login">Sign In</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
