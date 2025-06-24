import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getEnabledApps } from '@/config/apps';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  Tv, 
  DollarSign, 
  BarChart3, 
  Heart, 
  Globe, 
  Users, 
  Lock, 
  Receipt, 
  Wallet, 
  ArrowLeftRight, 
  Tag, 
  FileBarChart, 
  Settings as SettingsIcon,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Target,
  CreditCard,
  MessageSquarePlus,
  Plus,
  Sun,
  Moon,
  Calculator,
  Film,
  LogIn,
  UserPlus,
  Shield,
  FileText,
  Map,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useUserRoles } from '@/hooks/useUserRoles';

const iconMap = {
  Tv,
  DollarSign,
  BarChart3,
  Heart,
  Globe,
  Users,
  Lock,
  Receipt,
  Wallet,
  ArrowLeftRight,
  Tag,
  FileBarChart,
  Settings: SettingsIcon,
  Home,
  Menu,
  X,
  User,
  Target,
  CreditCard,
  MessageSquarePlus,
  Plus,
  Calculator,
  Film,
  LogIn,
  UserPlus,
  Shield,
  FileText,
  Map,
  TrendingUp,
  PieChart
};

// Define specific icons for finance routes
const financeRouteIcons = {
  '/finance': Home,
  '/finance/transactions': ArrowLeftRight,
  '/finance/wallets': Wallet,
  '/finance/categories': Tag,
  '/finance/transfers': ArrowLeftRight,
  '/finance/budgets': Target,
  '/finance/reports': TrendingUp,
  '/finance/settings': SettingsIcon,
  '/finance/credits': CreditCard
};

interface SidebarContentProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ isCollapsed = false, onToggleCollapse, isMobile = false }) => {
  const location = useLocation();
  const { settings } = useAppSettings();
  const { user } = useAuth();
  const { isAdmin, isLoading: rolesLoading, roles } = useUserRoles();
  const { theme, toggleTheme } = useTheme();
  const enabledApps = getEnabledApps(settings);
  
  // Determine which section should be open based on current route
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.startsWith('/public/')) return 'public';
    if (path.startsWith('/tv-shows')) return 'tv-shows';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/settlebill')) return 'settlebill';
    if (path.startsWith('/movies')) return 'movies';
    if (path.startsWith('/admin')) return 'admin';
    return null;
  };

  // Initialize accordion state based on current route
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const currentSection = getCurrentSection();
    return {
      'public': currentSection === 'public',
      'movies': currentSection === 'movies',
      'tv-shows': currentSection === 'tv-shows',
      'finance': currentSection === 'finance',
      'settlegara': currentSection === 'settlegara',
      'settlebill': currentSection === 'settlebill',
      'admin': currentSection === 'admin'
    };
  });

  // Update accordion state when route changes
  useEffect(() => {
    const currentSection = getCurrentSection();
    if (currentSection) {
      setOpenSections(prev => {
        // Close all sections first
        const newState = Object.keys(prev).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as Record<string, boolean>);
        
        // Open only the current section
        newState[currentSection] = true;
        return newState;
      });
    }
  }, [location.pathname]);

  const toggleSection = (sectionId: string) => {
    if (isCollapsed && !isMobile) return; // Don't toggle when collapsed on desktop only
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || Home;
  };

  // Filter apps based on user permissions, authentication status, and app settings
  const visibleApps = enabledApps.filter(app => {
    if (app.id === 'public') {
      return true;
    }
    
    if (app.id === 'movies' && !user) {
      return false;
    }
    
    if (app.id === 'tv-shows' && !settings.enabledApps.tvShows) {
      return false;
    }
    if (app.id === 'finance' && !settings.enabledApps.finance) {
      return false;
    }
    if (app.id === 'settlebill' && !settings.enabledApps.settlebill) {
      return false;
    }
    
    if ((app.id === 'tv-shows' || app.id === 'finance' || app.id === 'settlebill') && !user) {
      return false;
    }
    
    if (app.id === 'admin') {
      const shouldShow = isAdmin;
      console.log('Admin app visibility check - isAdmin:', isAdmin, 'shouldShow:', shouldShow);
      return shouldShow;
    }
    
    return true;
  });

  return (
    <div className="flex flex-col h-full relative bg-purple-50 dark:bg-purple-900/20">
      <div className="p-4 lg:p-6">
        <div className={cn(
          "flex",
          isCollapsed && !isMobile ? "justify-center items-center" : "flex-col items-center gap-4"
        )}>
          {onToggleCollapse && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn(
                "hidden lg:flex h-8 w-8 p-0",
                isCollapsed && "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 lg:px-4 space-y-2 overflow-y-auto">
        <Link
          to="/"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            location.pathname === "/" 
              ? "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100" 
              : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
          )}
          title={isCollapsed && !isMobile ? "Home" : undefined}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Home</span>}
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full justify-start text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
          )}
          title={isCollapsed && !isMobile ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          {(!isCollapsed || isMobile) && (
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </Button>

        {rolesLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Public Section with Accordion */}
            <Collapsible 
              open={isCollapsed && !isMobile ? true : openSections['public']}
              onOpenChange={() => toggleSection('public')}
            >
              <div className="space-y-1">
                <CollapsibleTrigger asChild>
                  <button 
                    className={cn(
                      "w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                      isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                    )}
                    disabled={isCollapsed && !isMobile}
                  >
                    <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">Public</span>
                        {openSections['public'] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1">
                  <Link
                    to="/public/shows"
                    title={isCollapsed && !isMobile ? "Public Shows" : undefined}
                    className={cn(
                      "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                      location.pathname === '/public/shows'
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                      isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                    )}
                  >
                    <Tv className="w-4 h-4 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && <span>Public Shows</span>}
                  </Link>
                  
                  <Link
                    to="/public/universes"
                    title={isCollapsed && !isMobile ? "Public Universes" : undefined}
                    className={cn(
                      "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                      location.pathname === '/public/universes'
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                      isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                    )}
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && <span>Public Universes</span>}
                  </Link>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* TV Shows Section with Full Navigation */}
            {(user || (!user && settings.enabledApps.tvShows)) && (
              <Collapsible 
                open={isCollapsed && !isMobile ? true : openSections['tv-shows']}
                onOpenChange={() => toggleSection('tv-shows')}
              >
                <div className="space-y-1">
                  <CollapsibleTrigger asChild>
                    <button 
                      className={cn(
                        "w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                      )}
                      disabled={isCollapsed && !isMobile}
                    >
                      <Tv className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="font-medium text-sm flex-1 text-left">TV Shows</span>
                          {openSections['tv-shows'] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1">
                    <Link
                      to="/tv-shows"
                      title={isCollapsed && !isMobile ? "Dashboard" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/tv-shows'
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Home className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Dashboard</span>}
                    </Link>

                    {user && (
                      <>
                        <Link
                          to="/tv-shows/my-shows"
                          title={isCollapsed && !isMobile ? "My Shows" : undefined}
                          className={cn(
                            "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                            location.pathname === '/tv-shows/my-shows'
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                          )}
                        >
                          <Heart className="w-4 h-4 flex-shrink-0" />
                          {(!isCollapsed || isMobile) && <span>My Shows</span>}
                        </Link>

                        <Link
                          to="/tv-shows/universes"
                          title={isCollapsed && !isMobile ? "My Universes" : undefined}
                          className={cn(
                            "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                            location.pathname === '/tv-shows/universes'
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                          )}
                        >
                          <Users className="w-4 h-4 flex-shrink-0" />
                          {(!isCollapsed || isMobile) && <span>My Universes</span>}
                        </Link>

                        <Link
                          to="/tv-shows/private-universes"
                          title={isCollapsed && !isMobile ? "Private Universes" : undefined}
                          className={cn(
                            "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                            location.pathname === '/tv-shows/private-universes'
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                          )}
                        >
                          <Lock className="w-4 h-4 flex-shrink-0" />
                          {(!isCollapsed || isMobile) && <span>Private Universes</span>}
                        </Link>
                      </>
                    )}

                    <Link
                      to="/tv-shows/public-shows"
                      title={isCollapsed && !isMobile ? "Public Shows" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/tv-shows/public-shows'
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Public Shows</span>}
                    </Link>

                    <Link
                      to="/tv-shows/public-universes"
                      title={isCollapsed && !isMobile ? "Public Universes" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/tv-shows/public-universes'
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Public Universes</span>}
                    </Link>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {/* SettleBill Section */}
            {user && settings.enabledApps.settlebill && (
              <Collapsible 
                open={isCollapsed && !isMobile ? true : openSections['settlebill']}
                onOpenChange={() => toggleSection('settlebill')}
              >
                <div className="space-y-1">
                  <CollapsibleTrigger asChild>
                    <button 
                      className={cn(
                        "w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                      )}
                      disabled={isCollapsed && !isMobile}
                    >
                      <Receipt className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="font-medium text-sm flex-1 text-left">SettleBill</span>
                          {openSections['settlebill'] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1">
                    <Link
                      to="/settlebill"
                      title={isCollapsed && !isMobile ? "Dashboard" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/settlebill' || location.pathname === '/settlebill/'
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Home className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Dashboard</span>}
                    </Link>

                    <Link
                      to="/settlebill/networks"
                      title={isCollapsed && !isMobile ? "Networks" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/settlebill/networks'
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Networks</span>}
                    </Link>

                    <Link
                      to="/settlebill/bills"
                      title={isCollapsed && !isMobile ? "Bills" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/settlebill/bills'
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Receipt className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Bills</span>}
                    </Link>

                    <Link
                      to="/settlebill/simplify"
                      title={isCollapsed && !isMobile ? "Simplify" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                        location.pathname === '/settlebill/simplify'
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                          : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                      )}
                    >
                      <Calculator className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span>Simplify</span>}
                    </Link>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {/* Other Apps (excluding SettleBill since we handled it separately) */}
            {visibleApps.filter(app => app.id !== 'public' && app.id !== 'tv-shows' && app.id !== 'settlebill').map((app) => (
              <Collapsible 
                key={app.id} 
                open={isCollapsed && !isMobile ? true : openSections[app.id]}
                onOpenChange={() => toggleSection(app.id)}
              >
                <div className="space-y-1">
                  <CollapsibleTrigger asChild>
                    <button 
                      className={cn(
                        "w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                        isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                      )}
                      disabled={isCollapsed && !isMobile}
                    >
                      {React.createElement(getIcon(app.icon), { 
                        className: `w-5 h-5 text-${app.color}-500 flex-shrink-0` 
                      })}
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="font-medium text-sm flex-1 text-left">{app.name}</span>
                          {openSections[app.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1">
                    {/* Organization Switcher for Finance section */}
                    {app.id === 'finance' && user && (!isCollapsed || isMobile) && (
                      <div className="px-3 pb-2">
                        <OrganizationSwitcher />
                      </div>
                    )}

                    {app.routes
                      .filter(route => route.path !== '/tv-shows/show/:slug')
                      .map((route) => {
                        // Use specific icons for finance routes
                        const IconComponent = app.id === 'finance' && financeRouteIcons[route.path as keyof typeof financeRouteIcons] 
                          ? financeRouteIcons[route.path as keyof typeof financeRouteIcons]
                          : getIcon(route.icon || 'Home');
                        
                        // Show routes only to authenticated users for protected apps
                        if ((app.id === 'finance' || app.id === 'admin' || app.id === 'settlegara' || app.id === 'movies') && !user) {
                          return null;
                        }
                        
                        return (
                          <Link
                            key={route.path}
                            to={route.path}
                            title={isCollapsed && !isMobile ? route.name : undefined}
                            className={cn(
                              "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                              location.pathname === route.path
                                ? `bg-${app.color}-100 text-${app.color}-700 dark:bg-${app.color}-900 dark:text-${app.color}-300`
                                : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                              isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                            )}
                          >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && <span>{route.name}</span>}
                          </Link>
                        );
                      })}

                    {/* Add additional routes for Finance - only for authenticated users */}
                    {app.id === 'finance' && user && (
                      <Link
                        to="/finance/credits"
                        title={isCollapsed && !isMobile ? "Credits" : undefined}
                        className={cn(
                          "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                          location.pathname === '/finance/credits'
                            ? `bg-${app.color}-100 text-${app.color}-700 dark:bg-${app.color}-900 dark:text-${app.color}-300`
                            : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                          isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                        )}
                      >
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        {(!isCollapsed || isMobile) && <span>Credits</span>}
                      </Link>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </>
        )}
      </nav>

      {user && (
        <div className="p-3 lg:p-4 border-t border-purple-200 dark:border-purple-700 space-y-1">
          <Link
            to="/profile"
            title={isCollapsed && !isMobile ? "Profile" : undefined}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
              isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
            )}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Profile</span>}
          </Link>
          <Link
            to="/settings"
            title={isCollapsed && !isMobile ? "Settings" : undefined}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
              isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
            )}
          >
            <SettingsIcon className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Settings</span>}
          </Link>
          <Link
            to="/requests"
            title={isCollapsed && !isMobile ? "Requests" : undefined}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
              location.pathname === "/requests" && "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100",
              isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
            )}
          >
            <MessageSquarePlus className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Requests</span>}
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/admin/add-show"
                title={isCollapsed && !isMobile ? "Add Show" : undefined}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                  location.pathname === "/admin/add-show" && "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100",
                  isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                )}
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || isMobile) && <span>Add Show</span>}
              </Link>
              <Link
                to="/admin/add-movies"
                title={isCollapsed && !isMobile ? "Add Movies" : undefined}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                  location.pathname === "/admin/add-movies" && "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100",
                  isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                )}
              >
                <Film className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || isMobile) && <span>Add Movies</span>}
              </Link>
            </>
          )}
        </div>
      )}

      <div className="p-3 lg:p-4 border-t border-purple-200 dark:border-purple-700 space-y-1">
        {!user && (
          <>
            <Link
              to="/login"
              title={isCollapsed && !isMobile ? "Sign In" : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
              )}
            >
              <LogIn className="w-4 h-4 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Sign In</span>}
            </Link>
            <Link
              to="/signup"
              title={isCollapsed && !isMobile ? "Sign Up" : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
                isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
              )}
            >
              <UserPlus className="w-4 h-4 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Sign Up</span>}
            </Link>
          </>
        )}
        <Link
          to="/privacy-policy"
          title={isCollapsed && !isMobile ? "Privacy Policy" : undefined}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
          )}
        >
          <Shield className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Privacy Policy</span>}
        </Link>
        <Link
          to="/terms-of-service"
          title={isCollapsed && !isMobile ? "Terms of Service" : undefined}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
          )}
        >
          <FileText className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Terms of Service</span>}
        </Link>
        <Link
          to="/sitemap"
          title={isCollapsed && !isMobile ? "Sitemap" : undefined}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors",
            isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
          )}
        >
          <Map className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Sitemap</span>}
        </Link>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden bg-background border border-border shadow-sm"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex bg-purple-50 dark:bg-purple-900/20 border-r border-purple-200 dark:border-purple-700 h-full flex-col transition-all duration-300",
        isDesktopCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent 
          isCollapsed={isDesktopCollapsed} 
          onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          isMobile={false}
        />
      </div>
    </>
  );
};
