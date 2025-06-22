
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworks } from '@/hooks/useSettleGaraNetworks';
import { useCreateBill } from '@/hooks/useSettleGaraBills';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BillFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({ onClose, onSuccess }) => {
  const { data: networks } = useNetworks();
  const createBillMutation = useCreateBill();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_amount: '',
    network_id: '',
    currency: 'USD'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.title.trim()) {
      setError('Bill title is required');
      return;
    }

    if (!formData.total_amount || Number(formData.total_amount) <= 0) {
      setError('Total amount must be greater than 0');
      return;
    }

    if (!formData.network_id) {
      setError('Please select a network');
      return;
    }

    const billData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      total_amount: Number(formData.total_amount),
      network_id: formData.network_id,
      currency: formData.currency,
      status: 'pending' as const
    };

    createBillMutation.mutate(billData, {
      onSuccess: () => {
        toast.success('Bill created successfully');
        setFormData({
          title: '',
          description: '',
          total_amount: '',
          network_id: '',
          currency: 'USD'
        });
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error creating bill:', error);
        setError(error.message || 'Failed to create bill');
        toast.error('Failed to create bill');
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Bill Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Dinner at restaurant"
              required
              disabled={createBillMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.total_amount}
              onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
              placeholder="0.00"
              required
              disabled={createBillMutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="network">Network *</Label>
          <Select
            value={formData.network_id}
            onValueChange={(value) => setFormData({ ...formData, network_id: value })}
            disabled={createBillMutation.isPending}
          >
            <SelectTrigger>
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
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
            disabled={createBillMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details about this expense..."
            rows={3}
            disabled={createBillMutation.isPending}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            type="submit"
            disabled={createBillMutation.isPending || !formData.title.trim() || !formData.total_amount || !formData.network_id}
            className="flex-1"
          >
            {createBillMutation.isPending ? 'Creating...' : 'Create Bill'}
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
