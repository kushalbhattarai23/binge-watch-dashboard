
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Receipt, Calculator, Settings, TrendingUp } from 'lucide-react';

export const SettleBillSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    { 
      path: '/settlebill', 
      icon: BarChart3, 
      label: 'Overview', 
      description: 'Dashboard and summaries',
      exact: true 
    },
    { 
      path: '/settlebill/networks', 
      icon: Users, 
      label: 'Networks', 
      description: 'Manage your groups' 
    },
    { 
      path: '/settlebill/bills', 
      icon: Receipt, 
      label: 'Bills', 
      description: 'Track expenses' 
    },
    { 
      path: '/settlebill/simplify', 
      icon: Calculator, 
      label: 'Simplify', 
      description: 'Optimize settlements' 
    },
    { 
      path: '/settlebill/settings', 
      icon: Settings, 
      label: 'Settings', 
      description: 'App preferences' 
    },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 border-r border-teal-200 dark:border-teal-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-2">SettleBill</h2>
        <p className="text-sm text-teal-600 dark:text-teal-400">Split bills with friends</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact 
            ? location.pathname === item.path
            : isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg transition-colors ${
                active
                  ? 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200'
                  : 'text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <Card className="mt-8 border-teal-200 dark:border-teal-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-medium text-teal-800 dark:text-teal-200">Quick Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-teal-600 dark:text-teal-400">Active Bills</span>
              <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300">
                -
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-teal-600 dark:text-teal-400">Networks</span>
              <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300">
                -
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
