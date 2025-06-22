
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddNetworkMember } from '@/hooks/useSettleGaraNetworks';
import { supabase } from '@/integrations/supabase/client';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberFormProps {
  networkId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ networkId, onClose, onSuccess }) => {
  const addMemberMutation = useAddNetworkMember();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    nickname: '',
    role: 'member'
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidatingUser, setIsValidatingUser] = useState(false);

  const validateUserExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
      
      return !error && !!data;
    } catch {
      return false;
    }
  };

  const createNotification = async (userEmail: string, networkName: string) => {
    try {
      const { error } = await supabase.rpc('create_notification', {
        p_user_email: userEmail,
        p_title: 'Added to Network',
        p_message: `You have been added to the network "${networkName}"`,
        p_type: 'member_added',
        p_network_id: networkId
      });
      
      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.user_name.trim()) {
      setError('Member name is required');
      return;
    }

    if (!formData.user_email.trim()) {
      setError('Member email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsValidatingUser(true);
    
    // Check if user exists in the application
    const userExists = await validateUserExists(formData.user_email);
    
    if (!userExists) {
      setError('User not found in the application. They must sign up first before being added to the network.');
      setIsValidatingUser(false);
      return;
    }

    setIsValidatingUser(false);

    const memberData = {
      network_id: networkId,
      user_name: formData.user_name.trim(),
      user_email: formData.user_email.trim().toLowerCase(),
      nickname: formData.nickname.trim() || null,
      role: formData.role,
      status: 'active'
    };

    addMemberMutation.mutate(memberData, {
      onSuccess: async () => {
        // Get network name and create notification
        try {
          const { data: network } = await supabase
            .from('settlegara_networks')
            .select('name')
            .eq('id', networkId)
            .single();

          await createNotification(
            formData.user_email.trim().toLowerCase(),
            network?.name || 'Unknown Network'
          );
        } catch (error) {
          console.error('Error getting network name:', error);
        }

        toast.success('Member added successfully');
        setFormData({
          user_name: '',
          user_email: '',
          nickname: '',
          role: 'member'
        });
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        console.error('Error adding member:', error);
        setError(error.message || 'Failed to add member');
        toast.error('Failed to add member');
      }
    });
  };

  const isLoading = addMemberMutation.isPending || isValidatingUser;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Add Network Member</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Member Name *</Label>
            <Input
              id="name"
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              placeholder="Enter member's full name"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              placeholder="Enter member's email"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">User must be registered in the application</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (Optional)</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="Enter a nickname for this member"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              type="submit"
              disabled={isLoading || !formData.user_name.trim() || !formData.user_email.trim()}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : 'Add Member'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
