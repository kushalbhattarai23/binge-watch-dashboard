import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworks, useNetworkMembers, useDeleteNetwork } from '@/hooks/useSettleGaraNetworks';
import { Users, Eye, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const NetworksList: React.FC = () => {
  const { data: networks, isLoading, error, refetch } = useNetworks();
  const deleteNetworkMutation = useDeleteNetwork();

  const handleDeleteNetwork = (networkId: string, networkName: string) => {
    if (window.confirm(`Are you sure you want to delete "${networkName}"? This will also delete all associated bills and splits.`)) {
      deleteNetworkMutation.mutate(networkId, {
        onSuccess: () => {
          toast.success('Network deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete network');
        }
      });
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load networks. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          Retry Loading Networks
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading networks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {networks?.map((network) => (
          <NetworkCard 
            key={network.id} 
            network={network} 
            onDelete={handleDeleteNetwork}
          />
        ))}
      </div>

      {networks?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No networks yet</h3>
          <p className="mb-4">Create your first network to start splitting bills with friends!</p>
          <Link to="/settlegara/networks/create">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Your First Network
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const NetworkCard: React.FC<{ 
  network: any; 
  onDelete: (id: string, name: string) => void;
}> = ({ network, onDelete }) => {
  const { data: members, error: membersError } = useNetworkMembers(network.id);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{network.name}</CardTitle>
            {network.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{network.description}</p>
            )}
          </div>
          <Badge variant="outline" className="flex-shrink-0">
            {members?.length || 0} members
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Created {new Date(network.created_at).toLocaleDateString()}
          </span>
        </div>

        {membersError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Failed to load members
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/settlegara/network/${network.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-3 h-3 mr-1" />
              Manage
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(network.id, network.name)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
