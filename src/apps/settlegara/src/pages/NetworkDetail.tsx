
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNetworkMembers, useNetworks } from '@/hooks/useSettleGaraNetworks';
import { AddMemberForm } from '../components/AddMemberForm';
import { Users, UserPlus, ArrowLeft, Settings, Trash2 } from 'lucide-react';

export const NetworkDetail: React.FC = () => {
  const { networkId } = useParams<{ networkId: string }>();
  const navigate = useNavigate();
  const { data: networks } = useNetworks();
  const { data: members, isLoading } = useNetworkMembers(networkId || '');
  const [showAddMember, setShowAddMember] = useState(false);

  const network = networks?.find(n => n.id === networkId);

  const handleBack = () => {
    navigate('/settlegara/networks');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading network details...</div>;
  }

  if (!network) {
    return <div className="text-center py-8">Network not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{network.name}</h2>
            <p className="text-gray-600">{members?.length || 0} members</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowAddMember(true)} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {showAddMember && (
        <AddMemberForm 
          networkId={networkId || ''}
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            // Refresh members list
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Network Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members && members.length > 0 ? (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_email}`} />
                      <AvatarFallback>{member.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.user_name}</h4>
                      <p className="text-sm text-gray-600">{member.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === 'admin' ? 'default' : 'outline'}>
                      {member.role}
                    </Badge>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No members yet. Add the first member to this network!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
