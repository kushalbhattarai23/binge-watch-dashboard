import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useNetworks, useNetworkMembers } from '@/hooks/useSettleGaraNetworks';
import { useNotifications } from '@/hooks/useSettleGaraNotifications';
import { Users, Mail, Plus, Bell } from 'lucide-react';

export const NetworksList: React.FC = () => {
  const { data: networks = [], isLoading } = useNetworks();
  const { data: notifications = [] } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading networks...</div>
      </div>
    );
  }

  if (networks.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No Networks Yet</h3>
        <p className="text-gray-600 mb-4">Create your first network to start splitting bills</p>
        <Link to="/settlegara/networks/create">
          <Button>Create Network</Button>
        </Link>
      </div>
    );
  }

  const getNetworkNotifications = (networkId: string) => {
    return notifications.filter(n => n.network_id === networkId && !n.read);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {networks.map((network) => {
        const networkNotifications = getNetworkNotifications(network.id);
        
        return (
          <Card key={network.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{network.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{network.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {networkNotifications.length > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      {networkNotifications.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <NetworkMembers networkId={network.id} />

              <div className="flex gap-2">
                <Link to={`/settlegara/network/${network.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Network
                  </Button>
                </Link>
                <Link to={`/settlegara/network/${network.id}`}>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    Manage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const NetworkMembers: React.FC<{ networkId: string }> = ({ networkId }) => {
  const { data: members = [] } = useNetworkMembers(networkId);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex -space-x-2">
        {members.slice(0, 4).map((member) => (
          <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
            <AvatarFallback>
              {(member.nickname || member.user_name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {members.length > 4 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
            <span className="text-xs font-medium">+{members.length - 4}</span>
          </div>
        )}
      </div>

      {members.length > 0 && (
        <div className="text-sm text-gray-600">
          {members.slice(0, 3).map(m => m.nickname || m.user_name).join(', ')}
          {members.length > 3 && '...'}
        </div>
      )}
    </div>
  );
};
