
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworks, useNetworkMembers } from '@/hooks/useSettleBillNetworks';
import { useCreateBill } from '@/hooks/useSettleGaraBills';
import { AlertCircle, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface BillFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  selectedNetworkId?: string;
}

interface MemberSplit {
  memberId: string;
  memberName: string;
  amount: number;
}

export const BillForm: React.FC<BillFormProps> = ({ onClose, onSuccess, selectedNetworkId }) => {
  const { data: networks } = useNetworks();
  const [selectedNetwork, setSelectedNetwork] = useState(selectedNetworkId || '');
  const { data: members } = useNetworkMembers(selectedNetwork);
  const createBillMutation = useCreateBill();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_amount: '',
    currency: 'USD',
    network_id: selectedNetworkId || ''
  });
  
  const [memberSplits, setMemberSplits] = useState<MemberSplit[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize member splits when network members are loaded
  useEffect(() => {
    if (members && members.length > 0) {
      const splits = members.map(member => ({
        memberId: member.id,
        memberName: member.user_name,
        amount: 0
      }));
      setMemberSplits(splits);
    }
  }, [members]);

  // Update network in form data when selected network changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, network_id: selectedNetwork }));
  }, [selectedNetwork]);

  const handleTotalAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, total_amount: value }));
    
    // Auto-distribute amount equally among members
    const totalAmount = parseFloat(value) || 0;
    if (memberSplits.length > 0 && totalAmount > 0) {
      const amountPerMember = totalAmount / memberSplits.length;
      setMemberSplits(prev => prev.map(split => ({
        ...split,
        amount: Math.round(amountPerMember * 100) / 100
      })));
    }
  };

  const handleMemberAmountChange = (memberId: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    setMemberSplits(prev => prev.map(split => 
      split.memberId === memberId ? { ...split, amount: numAmount } : split
    ));
  };

  const getTotalSplitAmount = () => {
    return memberSplits.reduce((sum, split) => sum + split.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!formData.title.trim()) {
        setError('Bill title is required');
        return;
      }
      
      if (!formData.network_id) {
        setError('Please select a network');
        return;
      }

      if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
        setError('Please enter a valid total amount');
        return;
      }

      const totalAmount = parseFloat(formData.total_amount);
      const splitTotal = getTotalSplitAmount();
      
      if (Math.abs(totalAmount - splitTotal) > 0.01) {
        setError(`Split amounts ($${splitTotal.toFixed(2)}) must equal total amount ($${totalAmount.toFixed(2)})`);
        return;
      }

      const billData = {
        network_id: formData.network_id,
        title: formData.title,
        description: formData.description || null,
        total_amount: totalAmount,
        currency: formData.currency,
        status: 'active'
      };

      const splits = memberSplits
        .filter(split => split.amount > 0)
        .map(split => ({
          member_id: split.memberId,
          amount: split.amount
        }));

      await createBillMutation.mutateAsync({
        bill: billData,
        splits: splits
      });

      toast.success('Bill created successfully!');
      setFormData({ title: '', description: '', total_amount: '', currency: 'USD', network_id: selectedNetworkId || '' });
      setMemberSplits([]);
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error creating bill:', error);
      setError(error.message || 'Failed to create bill');
      toast.error('Failed to create bill');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Bill Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Dinner at Restaurant"
              required
              disabled={createBillMutation.isPending}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the bill..."
              rows={3}
              disabled={createBillMutation.isPending}
              className="w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network">Network *</Label>
              <Select
                value={selectedNetwork}
                onValueChange={setSelectedNetwork}
                disabled={createBillMutation.isPending || !!selectedNetworkId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  {networks?.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_amount}
                  onChange={(e) => handleTotalAmountChange(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={createBillMutation.isPending}
                  className="pl-8 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {selectedNetwork && members && members.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Split Between Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {memberSplits.map((split) => (
                <div key={split.memberId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-teal-600">
                        {split.memberName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-sm md:text-base">{split.memberName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={split.amount}
                      onChange={(e) => handleMemberAmountChange(split.memberId, e.target.value)}
                      className="w-20 sm:w-24"
                      disabled={createBillMutation.isPending}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-medium text-sm md:text-base">Total Split Amount:</span>
                <span className={`font-bold text-sm md:text-base ${Math.abs(parseFloat(formData.total_amount) - getTotalSplitAmount()) > 0.01 ? 'text-red-600' : 'text-teal-600'}`}>
                  ${getTotalSplitAmount().toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            type="submit"
            disabled={createBillMutation.isPending || !formData.title.trim() || !selectedNetwork}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            {createBillMutation.isPending ? 'Creating Bill...' : 'Create Bill'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            disabled={createBillMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
