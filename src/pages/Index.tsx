import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppSelector from '@/components/AppSelector';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useAppSettings();

  const handleAppSelect = (appId: string) => {
    // When user is not logged in, show all apps but redirect to login for protected routes
    switch (appId) {
      case 'tv-shows':
        if (user) {
          if (settings.enabledApps.tvShows) {
            navigate('/tv-shows');
          }
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        break;
      case 'finance':
        if (user) {
          if (settings.enabledApps.finance) {
            navigate('/finance');
          }
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        break;
      case 'movies':
        if (user) {
          if (settings.enabledApps.movies) {
            navigate('/movies');
          }
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        break;
      case 'settlebill':
        if (user) {
          if (settings.enabledApps.settlebill) {
            navigate('/settlebill');
          }
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        break;
      case 'public':
        // Public routes are accessible to everyone
        if (user ? settings.enabledApps.public : true) {
          navigate('/public/shows');
        }
        break;
      case 'admin':
        if (user && settings.enabledApps.admin) {
          navigate('/admin');
        } else if (!user) {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        break;
      default:
        console.log('Unknown app selected:', appId);
    }
  };

  return (
    <div className="min-h-screen">
      <AppSelector onAppSelect={handleAppSelect} />
    </div>
  );
};

export default Index;
