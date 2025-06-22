
import React from 'react';
import { BillsList } from '../components/BillsList';
import { Button } from '@/components/ui/button';
import { Plus, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BillsListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              Your Bills
            </h1>
            <p className="text-gray-600">Track and manage all your shared expenses</p>
          </div>
          <Link to="/settlegara/bills/create">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Bill
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BillsList />
        </div>
      </div>
    </div>
  );
};
