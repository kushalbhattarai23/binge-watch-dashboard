
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Calculator,
  Home
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/settlebill',
    icon: LayoutDashboard,
  },
  {
    name: 'Networks',
    href: '/settlebill/networks',
    icon: Users,
  },
  {
    name: 'Bills',
    href: '/settlebill/bills',
    icon: Receipt,
  },
  {
    name: 'Simplify',
    href: '/settlebill/simplify',
    icon: Calculator,
  },
];

export const SettleBillSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Home className="w-5 h-5" />
          TrackerHub
        </Link>
        <p className="text-sm text-gray-500 mt-1">SettleBill</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/settlebill' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
