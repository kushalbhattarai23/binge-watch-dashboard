
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
    // Check if the app is enabled before navigating
    switch (appId) {
      case 'tv-shows':
        if (settings.enabledApps.tvShows && user) {
          navigate('/tv-shows');
        }
        break;
      case 'finance':
        if (settings.enabledApps.finance && user) {
          navigate('/finance');
        }
        break;
      case 'movies':
        if (settings.enabledApps.movies && user) {
          navigate('/movies');
        }
        break;
      case 'settlebill':
        if (settings.enabledApps.settlebill && user) {
          navigate('/settlebill');
        }
        break;
      case 'public':
        if (settings.enabledApps.public) {
          navigate('/public/shows');
        }
        break;
      case 'admin':
        if (settings.enabledApps.admin && user) {
          navigate('/admin');
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
