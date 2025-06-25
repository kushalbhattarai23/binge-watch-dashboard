
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Tv, DollarSign, Receipt, User, Film, Globe, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSettings } from '@/hooks/useAppSettings';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { settings } = useAppSettings();

  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }

  // Don't show only on landing page
  if (location.pathname === '/landing') {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      show: true,
      color: 'purple'
    },
    {
      path: '/public/universes',
      icon: Globe,
      label: 'Public',
      show: user ? settings.enabledApps.public : true, // Show when logged out or enabled
      color: 'blue'
    },
    {
      path: '/movies',
      icon: Film,
      label: 'Movies',
      show: user ? settings.enabledApps.movies : true, // Show when logged out or enabled
      color: 'blue'
    },
    {
      path: '/tv-shows',
      icon: Tv,
      label: 'TV Shows',
      show: user ? settings.enabledApps.tvShows : true, // Show when logged out or enabled
      color: 'purple'
    },
    {
      path: '/finance',
      icon: DollarSign,
      label: 'Finance',
      show: user ? settings.enabledApps.finance : true, // Show when logged out or enabled
      color: 'green'
    },
    {
      path: '/settlebill',
      icon: Receipt,
      label: 'Bills',
      show: user ? settings.enabledApps.settlebill : true, // Show when logged out or enabled
      color: 'orange'
    },
    {
      path: '/admin',
      icon: Settings,
      label: 'Admin',
      show: user && settings.enabledApps.admin,
      color: 'red'
    },
    {
      path: user ? '/profile' : '/login',
      icon: User,
      label: user ? 'Profile' : 'Login',
      show: true,
      color: 'purple'
    }
  ];

  // Filter items based on show condition
  const visibleItems = navItems.filter(item => item.show);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-purple-700 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                active
                  ? `text-${item.color}-600 bg-${item.color}-100 dark:text-${item.color}-400 dark:bg-${item.color}-900/50`
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
