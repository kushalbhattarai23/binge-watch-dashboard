
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, User, Heart, Globe } from 'lucide-react';
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

  // Don't show on login/signup pages or landing page
  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/landing') {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    ...(settings.enabledApps.public ? [{ path: '/public/shows', icon: Globe, label: 'Public' }] : []),
    ...(user ? [{ path: '/profile', icon: User, label: 'Profile' }] : [{ path: '/login', icon: User, label: 'Login' }]),
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                active
                  ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
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
