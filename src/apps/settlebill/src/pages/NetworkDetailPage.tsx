
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNetworkMembers, useNetworks, useRemoveNetworkMember } from '@/hooks/useSettleBillNetworks';
import { AddMemberForm } from '../components/AddMemberForm';
import { ArrowLeft, Users, UserPlus, Settings, Trash2, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const NetworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: networks } = useNetworks();
  const { data: members, isLoading } = useNetworkMembers(id || '');
  const [showAddMember, setShowAddMember] = useState(false);
  const removeNetworkMemberMutation = useRemoveNetworkMember();

  const network = networks?.find(n => n.id === id);
  const currentUserMember = members?.find(m => m.user_email === user?.email);
  const isAdmin = currentUserMember?.role === 'admin';

  const handleBack = () => {
    navigate('/settlebill/networks');
  };

  const handleCreateBill = () => {
    navigate(`/settlebill/bills/create?networkId=${id}`);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from this network?`)) {
      removeNetworkMemberMutation.mutate(
        { memberId, networkId: id || '' },
        {
          onSuccess: () => {
            toast.success('Member removed successfully');
          },
          onError: (error) => {
            console.error('Error removing member:', error);
            toast.error('Failed to remove member');
          }
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
        <div className="text-center py-8">Loading network details...</div>
      </div>
    );
  }

  if (!network) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
        <div className="text-center py-8">Network not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-bold truncate">{network.name}</h2>
              <p className="text-gray-600 text-sm md:text-base">{members?.length || 0} members</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreateBill} className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">
              <Receipt className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">Create Bill</span>
              <span className="xs:hidden">Bill</span>
            </Button>
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button onClick={() => setShowAddMember(true)} size="sm" className="flex-1 sm:flex-none">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Add Member</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {showAddMember && (
          <AddMemberForm 
            networkId={id || ''}
            networkName={network.name}
            onClose={() => setShowAddMember(false)}
            onSuccess={() => {
              // Refresh members list
            }}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="w-5 h-5" />
              Network Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_email}`} />
                        <AvatarFallback>{member.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm md:text-base truncate">{member.user_name}</h4>
                        <p className="text-xs md:text-sm text-gray-600 truncate">{member.user_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={member.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                        {member.role}
                      </Badge>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {member.status}
                      </Badge>
                      {isAdmin && member.user_email !== user?.email && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.user_name)}
                          disabled={removeNetworkMemberMutation.isPending}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm md:text-base">No members yet. Add the first member to this network!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
