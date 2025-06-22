
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Calculator, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNetworks, useDeleteNetwork } from '@/hooks/useSettleBillNetworks';
import { toast } from 'sonner';

export const NetworksList: React.FC = () => {
  const { data: networks, isLoading } = useNetworks();
  const deleteNetworkMutation = useDeleteNetwork();

  const handleDelete = (networkId: string) => {
    if (confirm('Are you sure you want to delete this network?')) {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!networks || networks.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No networks yet</h3>
        <p className="text-gray-500 mb-6">Create your first network to start splitting bills</p>
        <Link to="/settlebill/networks/create">
          <Button className="bg-green-600 hover:bg-green-700">
            Create Network
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {networks.map((network) => (
        <Card key={network.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  {network.name}
                </CardTitle>
                {network.description && (
                  <p className="text-gray-600 mt-1">{network.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/settlebill/simplify?network=${network.id}`}>
                  <Button size="sm" variant="outline">
                    <Calculator className="w-4 h-4 mr-1" />
                    Simplify
                  </Button>
                </Link>
                <Link to={`/settlebill/networks/${network.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(network.id)}
                  disabled={deleteNetworkMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(network.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
