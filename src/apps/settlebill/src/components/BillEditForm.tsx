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

interface Bill {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  date: string;
  network_id: string;
  created_by: string;
  bill_splits: BillSplit[];
}

interface BillSplit {
  id: string;
  bill_id: string;
  user_id: string;
  amount: number;
  is_settled: boolean;
  profiles: {
    email: string;
  };
}

interface BillEditFormProps {
  bill: Bill;
  networkId: string;
}

export const BillEditForm: React.FC<BillEditFormProps> = ({ bill, networkId }) => {
  const [title, setTitle] = useState(bill.title);
  const [description, setDescription] = useState(bill.description || '');
  const [amount, setAmount] = useState(bill.amount.toString());
  const [date, setDate] = useState(bill.date);
  const [paidBy, setPaidBy] = useState(bill.created_by);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('settlebill_network_members')
        .select(`
          user_id,
          profiles:user_id (
            email
          )
        `)
        .eq('network_id', networkId);

      if (data) {
        setMembers(data);
      }
    };

    fetchMembers();
  }, [networkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('settlebill_bills')
        .update({
          title,
          description,
          amount: parseFloat(amount),
          currency: currency,
          date,
          created_by: paidBy,
        })
        .eq('id', bill.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill updated successfully",
      });

      navigate(`/settlebill/bills/${bill.id}`);
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Bill</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="amount">Amount ({currency})</Label>
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
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.profiles?.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Bill'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/settlebill/bills/${bill.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
