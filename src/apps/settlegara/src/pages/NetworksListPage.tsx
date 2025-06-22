
import React from 'react';
import { NetworksList } from '../components/NetworksList';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NetworksListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              Your Networks
            </h1>
            <p className="text-gray-600">Manage your expense-sharing groups and invite members</p>
          </div>
          <Link to="/settlegara/networks/create">
            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Network
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <NetworksList />
        </div>
      </div>
    </div>
  );
};
