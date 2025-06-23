
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NetworksPage } from './NetworksPage';
import { CreateNetworkPage } from './CreateNetworkPage';
import { NetworkDetailPage } from './NetworkDetailPage';
import { BillsPage } from './BillsPage';
import { CreateBillPage } from './CreateBillPage';
import { BillDetailPage } from './BillDetailPage';
import { SimplifyPage } from './SimplifyPage';
import { OverviewPage } from './OverviewPage';
import { SettleBillSidebar } from '../components/SettleBillSidebar';

export const SettleBillApp: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SettleBillSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/networks" element={<NetworksPage />} />
          <Route path="/networks/create" element={<CreateNetworkPage />} />
          <Route path="/network/:id" element={<NetworkDetailPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bills/create" element={<CreateBillPage />} />
          <Route path="/bill/:id" element={<BillDetailPage />} />
          <Route path="/simplify" element={<SimplifyPage />} />
        </Routes>
      </div>
    </div>
  );
};
