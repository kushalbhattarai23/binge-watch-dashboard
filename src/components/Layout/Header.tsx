
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Tv, DollarSign, Film, Receipt, Globe, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getInitials = (email: string) => {
    return email?.charAt(0)?.toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Define quick links based on user authentication
  const quickLinks = user ? [
    { path: '/tv-shows', icon: Tv, label: 'TV Shows', color: 'purple' },
    { path: '/finance', icon: DollarSign, label: 'Finance', color: 'green' },
    { path: '/movies', icon: Film, label: 'Movies', color: 'blue' },
    { path: '/settlebill', icon: Receipt, label: 'SettleBill', color: 'red' },
  ] : [
    { path: '/public/universes', icon: Globe, label: 'Public Universes', color: 'blue' },
    { path: '/public/shows', icon: Tv, label: 'Public Shows', color: 'purple' },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 py-3 fixed top-0 left-0 md:left-64 right-0 z-40 h-16">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button - Always visible */}
          <SidebarTrigger />
          
          {/* TrackerHub Title - Hidden on desktop since it's in sidebar */}
          <div className="flex items-center md:hidden">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">T</span>
              </div>
              <span className="font-semibold text-lg">TrackerHub</span>
            </Link>
          </div>
          
          {/* Quick Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      link.color === 'red' && isActive && "bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white",
                      link.color === 'red' && !isActive && "text-rose-600 hover:text-red-700 hover:bg-rose-50",
                      link.color === 'purple' && isActive && "bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white",
                      link.color === 'purple' && !isActive && "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
                      link.color === 'green' && isActive && "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white",
                      link.color === 'green' && !isActive && "text-green-600 hover:text-green-700 hover:bg-green-50",
                      link.color === 'blue' && isActive && "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white",
                      link.color === 'blue' && !isActive && "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.email || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user.email}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
