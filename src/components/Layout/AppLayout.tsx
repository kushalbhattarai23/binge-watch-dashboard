
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';
import { SecondaryBottomNavigation } from './SecondaryBottomNavigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 p-3 pt-20 md:pt-20 sm:p-4 sm:pt-20 lg:pt-20 lg:p-6 overflow-auto pb-32 md:pb-0">
            {children || <Outlet />}
          </main>
          {/* Hide footer on mobile */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </SidebarInset>
        <SecondaryBottomNavigation />
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};
