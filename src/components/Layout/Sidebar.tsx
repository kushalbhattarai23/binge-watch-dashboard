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
  Film
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
  Film
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
  
  // Use separate storage keys for mobile and desktop
  const storageKey = isMobile ? 'sidebar-accordion-state-mobile' : 'sidebar-accordion-state-desktop';
  
  // State for accordion sections with localStorage persistence
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved accordion state:', error);
      }
    }
    return {
      'public': true,
      'movies': true,
      'tv-shows': true,
      'finance': true,
      'settlegara': true,
      'settlebill': true,
      'admin': true
    };
  });

  // Save accordion state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(openSections));
  }, [openSections, storageKey]);

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
    // Show public app to everyone
    if (app.id === 'public') {
      return true;
    }
    
    // Hide movies app if not authenticated
    if (app.id === 'movies' && !user) {
      return false;
    }
    
    // Check if app is enabled in settings
    if (app.id === 'tv-shows' && !settings.enabledApps.tvShows) {
      return false;
    }
    if (app.id === 'finance' && !settings.enabledApps.finance) {
      return false;
    }
    if (app.id === 'settlebill' && !settings.enabledApps.settlebill) {
      return false;
    }
    
    // Hide TV Shows, Finance, and SettleBill if not logged in
    if ((app.id === 'tv-shows' || app.id === 'finance' || app.id === 'settlebill') && !user) {
      return false;
    }
    
    // Admin app only for admin users
    if (app.id === 'admin') {
      const shouldShow = isAdmin;
      console.log('Admin app visibility check - isAdmin:', isAdmin, 'shouldShow:', shouldShow);
      return shouldShow;
    }
    
    return true;
  });

  console.log('Visible apps:', visibleApps.map(app => app.id));

  return (
    <div className="flex flex-col h-full relative bg-purple-50 dark:bg-purple-900/20">
      <div className="p-4 lg:p-6">
        <div className={cn(
          "flex",
          isCollapsed && !isMobile ? "justify-center items-center" : "flex-col items-center gap-4"
        )}>
          <Link to="/" className={cn("flex items-center space-x-2")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">T</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-semibold text-lg">TrackerHub</span>
            )}
          </Link>
          
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
          visibleApps.map((app) => {
            if (app.id === 'public') {
              return (
                <div key={app.id}>
                  <div 
                    className={cn(
                      "w-full flex items-center space-x-2 px-3 py-2",
                      isCollapsed && !isMobile && "lg:justify-center lg:space-x-0"
                    )}
                  >
                    {React.createElement(getIcon(app.icon), { 
                      className: `w-5 h-5 text-${app.color}-500 flex-shrink-0` 
                    })}
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium text-sm flex-1 text-left">{app.name}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {app.routes
                      .filter(route => route.path !== '/tv-shows/show/:slug')
                      .map((route) => {
                        const Icon = getIcon(route.icon || 'Home');
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
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && <span>{route.name}</span>}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            }
            
            return (
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
                        const Icon = getIcon(route.icon || 'Home');
                        
                        // Show routes only to authenticated users for protected apps
                        if ((app.id === 'finance' || app.id === 'admin' || app.id === 'settlegara' || app.id === 'movies' || app.id === 'settlebill') && !user) {
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
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && <span>{route.name}</span>}
                          </Link>
                        );
                      })}

                    {/* Add special routes for TV Shows - available to everyone */}
                    {app.id === 'tv-shows' && (
                      <>
                        {/* Show user-specific TV shows routes only to authenticated users */}
                        {user && (
                          <Link
                            to="/tv-shows/universes"
                            title={isCollapsed && !isMobile ? "My Universes" : undefined}
                            className={cn(
                              "flex items-center space-x-3 px-3 lg:px-6 py-2 rounded-lg transition-colors text-sm",
                              location.pathname === '/tv-shows/universes'
                                ? `bg-${app.color}-100 text-${app.color}-700 dark:bg-${app.color}-900 dark:text-${app.color}-300`
                                : "text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-800",
                              isCollapsed && !isMobile && "lg:justify-center lg:space-x-0 lg:px-3"
                            )}
                          >
                            <Users className="w-4 h-4 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && <span>My Universes</span>}
                          </Link>
                        )}
                      </>
                    )}

                    {/* Add additional routes for Finance - only for authenticated users */}
                    {app.id === 'finance' && user && (
                      <>
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
                      </>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })
        )}
      </nav>

      {/* Show profile and settings only to authenticated users */}
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
          {/* Add Show and Add Movies links - only for admins */}
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
