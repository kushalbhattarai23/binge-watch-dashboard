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
  const navItems = [{
    path: '/settlebill',
    icon: BarChart3,
    label: 'Overview',
    description: 'Dashboard and summaries',
    exact: true
  }, {
    path: '/settlebill/networks',
    icon: Users,
    label: 'Networks',
    description: 'Manage your groups'
  }, {
    path: '/settlebill/bills',
    icon: Receipt,
    label: 'Bills',
    description: 'Track expenses'
  }, {
    path: '/settlebill/simplify',
    icon: Calculator,
    label: 'Simplify',
    description: 'Optimize settlements'
  }, {
    path: '/settlebill/settings',
    icon: Settings,
    label: 'Settings',
    description: 'App preferences'
  }];
  return;
};