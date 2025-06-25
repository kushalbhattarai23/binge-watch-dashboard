
import { AppSettings } from '@/hooks/useAppSettings';

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  routes: {
    path: string;
    name: string;
    icon?: string;
  }[];
}

export const apps: AppConfig[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Personal finance tracking and management',
    icon: 'DollarSign',
    color: 'green',
    routes: [
      { path: '/finance', name: 'Dashboard' },
      { path: '/finance/transactions', name: 'Transactions' },
      { path: '/finance/wallets', name: 'Wallets' },
      { path: '/finance/categories', name: 'Categories' },
      { path: '/finance/transfers', name: 'Transfers' },
      { path: '/finance/budgets', name: 'Budgets' },
      { path: '/finance/reports', name: 'Reports' },
      { path: '/finance/settings', name: 'Settings' }
    ]
  },
  {
    id: 'tv-shows',
    name: 'TV Shows',
    description: 'Track your favorite TV shows and episodes',
    icon: 'Tv',
    color: 'purple',
    routes: [
      { path: '/tv-shows', name: 'Dashboard' },
      { path: '/tv-shows/my-shows', name: 'My Shows' },
      { path: '/tv-shows/universes', name: 'Universes' },
      { path: '/tv-shows/public-shows', name: 'Public Shows' },
      { path: '/tv-shows/public-universes', name: 'Public Universes' }
    ]
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Track your movie watchlist and ratings',
    icon: 'Film',
    color: 'blue',
    routes: [
      { path: '/movies', name: 'Movies' }
    ]
  },
  {
    id: 'settlebill',
    name: 'SettleBill',
    description: 'Split bills and manage expenses with friends',
    icon: 'Receipt',
    color: 'rose',
    routes: [
      { path: '/settlebill', name: 'Dashboard' }
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative tools and settings',
    icon: 'Settings',
    color: 'amber',
    routes: [
      { path: '/admin', name: 'Dashboard' },
      { path: '/admin/users', name: 'Users' },
      { path: '/admin/content', name: 'Content' }
    ]
  },
  {
    id: 'public',
    name: 'Public',
    description: 'Public shows and universes',
    icon: 'Globe',
    color: 'blue',
    routes: [
      { path: '/public/shows', name: 'Public Shows' },
      { path: '/public/universes', name: 'Public Universes' }
    ]
  }
];

export const getEnabledApps = (settings: AppSettings) => {
  return apps.filter(app => settings.enabledApps[app.id as keyof typeof settings.enabledApps]);
};
