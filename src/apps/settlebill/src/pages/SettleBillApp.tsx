
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OverviewPage } from './OverviewPage';
import { NetworksPage } from './NetworksPage';
import { BillsPage } from './BillsPage';
import { SimplifyPage } from './SimplifyPage';
import { CreateNetworkPage } from './CreateNetworkPage';
import { NetworkDetailPage } from './NetworkDetailPage';
import { CreateBillPage } from './CreateBillPage';
import { BillDetailPage } from './BillDetailPage';
import SettleBillSettingsPage from './SettingsPage';
import { SettleBillSidebar } from '../components/SettleBillSidebar';

export const SettleBillApp: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background w-full">
      <SettleBillSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/networks" element={<NetworksPage />} />
            <Route path="/networks/create" element={<CreateNetworkPage />} />
            <Route path="/networks/:id" element={<NetworkDetailPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/bills/create" element={<CreateBillPage />} />
            <Route path="/bills/:id" element={<BillDetailPage />} />
            <Route path="/simplify" element={<SimplifyPage />} />
            <Route path="/settings" element={<SettleBillSettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
