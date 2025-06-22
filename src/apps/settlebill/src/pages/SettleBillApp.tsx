
import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NetworksPage } from './NetworksPage';
import { BillsPage } from './BillsPage';
import { CreateNetworkPage } from './CreateNetworkPage';
import { CreateBillPage } from './CreateBillPage';
import { SimplifyPage } from './SimplifyPage';
import { NetworkDetailPage } from './NetworkDetailPage';
import { BillDetailPage } from './BillDetailPage';
import { Users, Receipt, Calculator, Home, ArrowLeft } from 'lucide-react';

const SettleBillApp: React.FC = () => {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">SettleBill</h1>
              <p className="text-gray-600">Split bills and settle expenses with friends</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!isSubPage && (
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-lg shadow-sm">
            <NavTab to="/settlebill" icon={<Home className="w-4 h-4" />} label="Overview" />
            <NavTab to="/settlebill/networks" icon={<Users className="w-4 h-4" />} label="Networks" />
            <NavTab to="/settlebill/bills" icon={<Receipt className="w-4 h-4" />} label="Bills" />
            <NavTab to="/settlebill/simplify" icon={<Calculator className="w-4 h-4" />} label="Simplify" />
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/settlebill/networks" replace />} />
          <Route path="/networks" element={<NetworksPage />} />
          <Route path="/networks/create" element={<CreateNetworkPage />} />
          <Route path="/networks/:id" element={<NetworkDetailPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bills/create" element={<CreateBillPage />} />
          <Route path="/bills/:id" element={<BillDetailPage />} />
          <Route path="/simplify" element={<SimplifyPage />} />
          <Route path="*" element={<Navigate to="/settlebill/networks" replace />} />
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

export default SettleBillApp;
