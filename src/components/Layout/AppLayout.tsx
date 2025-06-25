
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';
import { SecondaryBottomNavigation } from './SecondaryBottomNavigation';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full relative">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 p-3 pt-20 md:pt-20 sm:p-4 sm:pt-20 lg:pt-20 lg:p-6 overflow-auto pb-32 md:pb-0">
            {children || <Outlet />}
          </main>
        </div>
      </div>
      {/* Hide footer on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      <SecondaryBottomNavigation />
      <BottomNavigation />
    </div>
  );
};
