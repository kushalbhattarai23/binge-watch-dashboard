
import React, { useState, useEffect } from 'react';
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
  Calculator,
  LogIn,
  UserPlus,
  Shield,
  FileText,
  Map
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { settings } = useAppSettings();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Determine which app is currently active
  const getCurrentApp = () => {
    const path = location.pathname;
    if (path.startsWith('/tv-shows')) return 'tv-shows';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/movies')) return 'movies';
    if (path.startsWith('/settlebill')) return 'settlebill';
    if (path.startsWith('/admin')) return 'admin';
    return null;
  };

  // Set default open accordion based on current route
  useEffect(() => {
    const currentApp = getCurrentApp();
    if (currentApp && !openAccordions.includes(currentApp)) {
      setOpenAccordions([currentApp]);
    }
  }, [location.pathname]);

  const handleAccordionChange = (value: string[]) => {
    setOpenAccordions(value);
  };

  const publicRoutes = [
    { name: 'Shows', href: '/public/shows', icon: Tv },
    { name: 'Universes', href: '/public/universes', icon: Globe },
  ];

  const tvShowsRoutes = user && settings.enabledApps.tvShows ? [
    { name: 'Dashboard', href: '/tv-shows', icon: BarChart3 },
    { name: 'My Shows', href: '/tv-shows/my-shows', icon: Tv },
    { name: 'Universes', href: '/tv-shows/universes', icon: Globe },
    { name: 'Public Shows', href: '/tv-shows/public', icon: Globe },
    { name: 'Public Universes', href: '/tv-shows/public/universes', icon: Globe },
  ] : [];

  const financeRoutes = user && settings.enabledApps.finance ? [
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

  const movieRoutes = user && settings.enabledApps.movies ? [
    { name: 'My Movies', href: '/movies', icon: Film },
  ] : [];

  const settlebillRoutes = user && settings.enabledApps.settlebill ? [
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

  // Order apps based on current active app (active app first)
  const currentApp = getCurrentApp();
  const appSections = [];

  // Add current app first if it exists
  if (currentApp === 'settlebill' && settlebillRoutes.length > 0) {
    appSections.push({ id: 'settlebill', title: 'SettleBill', routes: settlebillRoutes });
  }
  if (currentApp === 'tv-shows' && tvShowsRoutes.length > 0) {
    appSections.push({ id: 'tv-shows', title: 'TV Shows', routes: tvShowsRoutes });
  }
  if (currentApp === 'finance' && financeRoutes.length > 0) {
    appSections.push({ id: 'finance', title: 'Finance', routes: financeRoutes });
  }
  if (currentApp === 'movies' && movieRoutes.length > 0) {
    appSections.push({ id: 'movies', title: 'Movies', routes: movieRoutes });
  }
  if (currentApp === 'admin' && adminRoutes.length > 0) {
    appSections.push({ id: 'admin', title: 'Admin', routes: adminRoutes });
  }

  // Add remaining apps
  if (currentApp !== 'settlebill' && settlebillRoutes.length > 0) {
    appSections.push({ id: 'settlebill', title: 'SettleBill', routes: settlebillRoutes });
  }
  if (currentApp !== 'tv-shows' && tvShowsRoutes.length > 0) {
    appSections.push({ id: 'tv-shows', title: 'TV Shows', routes: tvShowsRoutes });
  }
  if (currentApp !== 'finance' && financeRoutes.length > 0) {
    appSections.push({ id: 'finance', title: 'Finance', routes: financeRoutes });
  }
  if (currentApp !== 'movies' && movieRoutes.length > 0) {
    appSections.push({ id: 'movies', title: 'Movies', routes: movieRoutes });
  }
  if (currentApp !== 'admin' && adminRoutes.length > 0) {
    appSections.push({ id: 'admin', title: 'Admin', routes: adminRoutes });
  }

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

        {user && appSections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Applications</SidebarGroupLabel>
            <SidebarGroupContent>
              <Accordion 
                type="multiple" 
                value={openAccordions} 
                onValueChange={handleAccordionChange}
                className="w-full"
              >
                {appSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 px-2 hover:bg-sidebar-accent rounded-md">
                      <span className="text-sm font-medium">{section.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <SidebarMenu>
                        {section.routes.map((item) => {
                          const Icon = item.icon;
                          return (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href)} className="ml-4">
                                <Link to={item.href}>
                                  <Icon className="h-4 w-4" />
                                  <span>{item.name}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/settings')}>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Legal & Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/privacy-policy')}>
                  <Link to="/privacy-policy">
                    <Shield className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/terms-of-service')}>
                  <Link to="/terms-of-service">
                    <FileText className="h-4 w-4" />
                    <span>Terms of Service</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/sitemap')}>
                  <Link to="/sitemap">
                    <Map className="h-4 w-4" />
                    <span>Sitemap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
