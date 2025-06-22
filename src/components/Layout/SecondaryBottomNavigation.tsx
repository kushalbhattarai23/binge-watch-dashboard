
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Heart, Globe, Lock, Users, Receipt, Wallet, Tag, ArrowLeftRight, Target, FileBarChart, Settings, CreditCard, Calculator, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export const SecondaryBottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

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

  // Define routes for each app section with their colors
  const getSecondaryNavItems = () => {
    const pathname = location.pathname;

    // TV Shows section - purple theme
    if (pathname.startsWith('/tv-shows')) {
      return {
        items: [
          { path: '/tv-shows', icon: BarChart3, label: 'Dashboard' },
          { path: '/tv-shows/my-shows', icon: Heart, label: 'My Shows' },
          { path: '/tv-shows/universes', icon: Users, label: 'Universes' },
          { path: '/tv-shows/public-shows', icon: Globe, label: 'Browse' }
        ],
        color: 'purple'
      };
    }

    // Finance section - green theme
    if (pathname.startsWith('/finance')) {
      return {
        items: [
          { path: '/finance', icon: BarChart3, label: 'Dashboard' },
          { path: '/finance/wallets', icon: Wallet, label: 'Wallets' },
          { path: '/finance/transactions', icon: Receipt, label: 'Transactions' },
          { path: '/finance/categories', icon: Tag, label: 'Categories' }
        ],
        color: 'green'
      };
    }

    // SettleGara section - orange theme
    if (pathname.startsWith('/settlegara')) {
      return {
        items: [
          { path: '/settlegara', icon: BarChart3, label: 'Dashboard' },
          { path: '/settlegara/bills', icon: Receipt, label: 'Bills' },
          { path: '/settlegara/networks', icon: Users, label: 'Networks' },
          { path: '/settlegara/simplify', icon: Calculator, label: 'Simplify' }
        ],
        color: 'orange'
      };
    }

    // Public section - purple theme (default)
    if (pathname.startsWith('/public')) {
      return {
        items: [
          { path: '/public/universes', icon: Globe, label: 'Universes' },
          { path: '/public/shows', icon: Heart, label: 'Shows' }
        ],
        color: 'purple'
      };
    }

    return { items: [], color: 'purple' };
  };

  const { items: secondaryNavItems, color } = getSecondaryNavItems();

  // Don't render if no secondary nav items or user not authenticated for protected routes
  if (secondaryNavItems.length === 0) {
    return null;
  }

  // Check if user needs to be authenticated for certain sections
  if ((location.pathname.startsWith('/tv-shows') || location.pathname.startsWith('/finance') || location.pathname.startsWith('/settlegara')) && !user) {
    return null;
  }

  // Define color classes based on the section
  const getColorClasses = (isActive: boolean) => {
    if (color === 'green') {
      return isActive
        ? 'text-green-700 bg-green-200 dark:text-green-300 dark:bg-green-800/70'
        : 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300';
    } else if (color === 'orange') {
      return isActive
        ? 'text-orange-700 bg-orange-200 dark:text-orange-300 dark:bg-orange-800/70'
        : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300';
    } else {
      return isActive
        ? 'text-purple-700 bg-purple-200 dark:text-purple-300 dark:bg-purple-800/70'
        : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300';
    }
  };

  const backgroundClass = color === 'green' 
    ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600'
    : color === 'orange'
    ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600'
    : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600';

  return (
    <div className={`fixed bottom-16 left-0 right-0 ${backgroundClass} border-t z-40 md:hidden`}>
      <div className="flex justify-around items-center py-1 px-2">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${getColorClasses(active)}`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
