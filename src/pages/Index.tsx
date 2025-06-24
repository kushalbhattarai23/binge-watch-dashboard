
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppSelector from '@/components/AppSelector';

const Index = () => {
  const navigate = useNavigate();

  const handleAppSelect = (appId: string) => {
    switch (appId) {
      case 'tv-shows':
        navigate('/tv-shows');
        break;
      case 'finance':
        navigate('/finance');
        break;
      case 'movies':
        navigate('/movies');
        break;
      case 'settlebill':
        navigate('/settlebill');
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
