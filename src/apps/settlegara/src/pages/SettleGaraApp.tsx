
import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OverviewPage } from './OverviewPage';
import { NetworksListPage } from './NetworksListPage';
import { BillsListPage } from './BillsListPage';
import { CreateNetworkPage } from './CreateNetworkPage';
import { CreateBillPage } from './CreateBillPage';
import { SimplifyPage } from './SimplifyPage';
import { NetworkDetail } from './NetworkDetail';
import { BillDetail } from './BillDetail';
import { Users, Receipt, Calculator, Home, ArrowLeft } from 'lucide-react';

const SettleGaraApp: React.FC = () => {
  const location = useLocation();
  
  const isSubPage = location.pathname.includes('/network/') || 
                   location.pathname.includes('/bill/') ||
                   location.pathname.includes('/create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {isSubPage && (
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">SettleGara</h1>
              <p className="text-gray-600">Split bills and settle expenses with friends</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!isSubPage && (
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-lg shadow-sm">
            <NavTab to="/settlegara" icon={<Home className="w-4 h-4" />} label="Overview" />
            <NavTab to="/settlegara/networks" icon={<Users className="w-4 h-4" />} label="Networks" />
            <NavTab to="/settlegara/bills" icon={<Receipt className="w-4 h-4" />} label="Bills" />
            <NavTab to="/settlegara/simplify" icon={<Calculator className="w-4 h-4" />} label="Simplify" />
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/networks" element={<NetworksListPage />} />
          <Route path="/networks/create" element={<CreateNetworkPage />} />
          <Route path="/network/:networkId" element={<NetworkDetail />} />
          <Route path="/bills" element={<BillsListPage />} />
          <Route path="/bills/create" element={<CreateBillPage />} />
          <Route path="/bill/:billId" element={<BillDetail />} />
          <Route path="/simplify" element={<SimplifyPage />} />
          <Route path="*" element={<Navigate to="/settlegara" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const NavTab: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className={`flex items-center gap-2 ${isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

export default SettleGaraApp;
