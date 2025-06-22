import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tv, DollarSign, Film, Receipt, Calculator } from 'lucide-react';

interface AppSelectorProps {
  onAppSelect: (appId: string) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ onAppSelect }) => {
  const apps = [
    {
      id: 'tv-shows',
      name: 'TV Shows',
      description: 'Track your favorite shows and episodes',
      icon: Tv,
      color: 'from-purple-500 to-pink-500',
      route: '/tv-shows'
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Manage wallets and track expenses',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      route: '/finance'
    },
    {
      id: 'movies',
      name: 'Movies',
      description: 'Track your movie watchlist and ratings',
      icon: Film,
      color: 'from-blue-500 to-cyan-500',
      route: '/movies'
    },
    {
      id: 'settlegara',
      name: 'SettleGara',
      description: 'Split bills and settle expenses with friends',
      icon: Receipt,
      color: 'from-orange-500 to-red-500',
      route: '/settlegara'
    },
    {
      id: 'settlebill',
      name: 'SettleBill',
      description: 'Advanced bill splitting and expense management',
      icon: Calculator,
      color: 'from-indigo-500 to-purple-500',
      route: '/settlebill'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {apps.map((app) => (
        <Card 
          key={app.id} 
          className="border-2 border-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => onAppSelect(app.id)}
        >
          <CardHeader className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${app.color}`}>
              <app.icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold">{app.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-gray-500">
              {app.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppSelector;
