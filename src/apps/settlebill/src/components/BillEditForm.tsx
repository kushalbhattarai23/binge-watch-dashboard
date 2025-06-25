
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';
import { useUpdateBill } from '@/hooks/useSettleGaraBills';
import type { Bill } from '@/hooks/useSettleGaraBills';

interface NetworkMember {
  id: string;
  network_id: string;
  user_email: string;
  user_name: string;
  role: string;
  status: string;
}

interface BillEditFormProps {
  bill: Bill;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const BillEditForm: React.FC<BillEditFormProps> = ({ bill, onClose, onSuccess }) => {
  const [title, setTitle] = useState(bill.title);
  const [description, setDescription] = useState(bill.description || '');
  const [amount, setAmount] = useState(bill.total_amount.toString());
  const [date, setDate] = useState(bill.created_at.split('T')[0]);
  const [paidBy, setPaidBy] = useState(bill.paid_by || bill.created_by);
  const [members, setMembers] = useState<NetworkMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const updateBillMutation = useUpdateBill();

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('settlegara_network_members')
        .select('*')
        .eq('network_id', bill.network_id);

      if (data) {
        setMembers(data);
      }
    };

    fetchMembers();
  }, [bill.network_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateBillMutation.mutateAsync({
        id: bill.id,
        title,
        description,
        total_amount: parseFloat(amount),
        currency: currency.code,
        paid_by: paidBy,
      });

      toast({
        title: "Success",
        description: "Bill updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/settlebill/bills/${bill.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="amount">Amount ({currency.code})</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="paidBy">Paid By</Label>
        <Select value={paidBy} onValueChange={setPaidBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select who paid" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.user_email}>
                {member.user_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Bill'}
        </Button>
        {onClose && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
