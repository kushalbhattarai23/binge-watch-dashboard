
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddNetworkMember } from '@/hooks/useSettleBillNetworks';
import { X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddMemberFormProps {
  networkId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ networkId, onClose, onSuccess }) => {
  const { toast } = useToast();
  const addMemberMutation = useAddNetworkMember();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    role: 'member'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    const memberData = {
      network_id: networkId,
      user_name: formData.user_name.trim(),
      user_email: formData.user_email.trim().toLowerCase(),
      role: formData.role,
      status: 'active'
    };

    addMemberMutation.mutate(memberData, {
      onSuccess: () => {
        toast({
          title: 'Member Added',
          description: 'Member has been successfully added to the network.',
        });
        setFormData({
          user_name: '',
          user_email: '',
          role: 'member'
        });
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        console.error('Error adding member:', error);
        setError(error.message || 'Failed to add member');
        toast({
          title: 'Error',
          description: 'Failed to add member. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

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
              disabled={addMemberMutation.isPending}
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
              disabled={addMemberMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={addMemberMutation.isPending}
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
              disabled={addMemberMutation.isPending || !formData.user_name.trim() || !formData.user_email.trim()}
              className="flex-1"
            >
              {addMemberMutation.isPending ? 'Adding...' : 'Add Member'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={addMemberMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
