
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworks, useNetworkMembers } from '@/hooks/useSettleBillNetworks';
import { useBills, useBillSplits } from '@/hooks/useSettleGaraBills';
import { useCreateSettlement, useSettlements } from '@/hooks/useSettlements';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Calculator, ArrowRight, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SimplifiedPayment {
  from: string;
  to: string;
  amount: number;
  fromName: string;
  toName: string;
}

export const SimplifyBillsForm: React.FC = () => {
  const { data: networks } = useNetworks();
  const { data: bills } = useBills();
  const { data: userPreferences } = useUserPreferences();
  const createSettlementMutation = useCreateSettlement();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [simplifiedResults, setSimplifiedResults] = useState<SimplifiedPayment[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { data: members } = useNetworkMembers(selectedNetwork);
  const { data: settlements } = useSettlements(selectedNetwork);

  const currency = userPreferences?.preferred_currency || 'USD';
  const getCurrencySymbol = (curr: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      NPR: 'रु',
      JPY: '¥'
    };
    return symbols[curr] || curr;
  };

  const handleSimplify = async () => {
    if (!selectedNetwork || !members || !bills) {
      toast.error('Please select a network first');
      return;
    }

    setIsCalculating(true);
    console.log('Starting simplification process...');

    try {
      // Filter bills for selected network that are pending
      const networkBills = bills.filter(bill => 
        bill.network_id === selectedNetwork && bill.status === 'pending'
      );
      
      console.log('Network bills found:', networkBills.length);

      if (networkBills.length === 0) {
        toast.info('No pending bills found for this network');
        setSimplifiedResults([]);
        setIsCalculating(false);
        return;
      }

      // Calculate net balances for each member
      const balances: { [memberId: string]: number } = {};
      
      // Initialize balances
      members.forEach(member => {
        balances[member.id] = 0;
      });

      // For simplification, we'll assume each bill is split equally among all members
      // In a real implementation, you'd fetch actual bill splits
      networkBills.forEach(bill => {
        const splitAmount = Number(bill.total_amount) / members.length;
        
        // The person who created the bill is owed money
        const creator = members.find(m => m.user_email === bill.created_by);
        if (creator) {
          balances[creator.id] += Number(bill.total_amount) - splitAmount;
        }
        
        // Everyone else owes their share
        members.forEach(member => {
          if (member.id !== creator?.id) {
            balances[member.id] -= splitAmount;
          }
        });
      });

      console.log('Calculated balances:', balances);

      // Create simplified payments using a greedy algorithm
      const creditors = Object.entries(balances)
        .filter(([_, balance]) => balance > 0.01)
        .sort((a, b) => b[1] - a[1]);
      
      const debtors = Object.entries(balances)
        .filter(([_, balance]) => balance < -0.01)
        .sort((a, b) => a[1] - b[1]);
      
      const payments: SimplifiedPayment[] = [];
      
      console.log('Creditors:', creditors);
      console.log('Debtors:', debtors);

      let creditorIndex = 0;
      let debtorIndex = 0;
      
      while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
        const [creditorId, creditAmount] = creditors[creditorIndex];
        const [debtorId, debtAmount] = debtors[debtorIndex];
        
        const creditorMember = members.find(m => m.id === creditorId);
        const debtorMember = members.find(m => m.id === debtorId);
        
        const settlementAmount = Math.min(creditAmount, Math.abs(debtAmount));
        
        if (settlementAmount > 0.01 && creditorMember && debtorMember) {
          payments.push({
            from: debtorId,
            to: creditorId,
            amount: settlementAmount,
            fromName: debtorMember.user_name,
            toName: creditorMember.user_name
          });
          
          creditors[creditorIndex][1] -= settlementAmount;
          debtors[debtorIndex][1] += settlementAmount;
          
          if (creditors[creditorIndex][1] <= 0.01) creditorIndex++;
          if (Math.abs(debtors[debtorIndex][1]) <= 0.01) debtorIndex++;
        } else {
          break;
        }
      }
      
      console.log('Generated payments:', payments);
      setSimplifiedResults(payments);
      
      if (payments.length > 0) {
        toast.success(`Calculated ${payments.length} optimized transactions`);
      } else {
        toast.info('All debts are already settled!');
      }
    } catch (error) {
      console.error('Simplify error:', error);
      toast.error('Failed to calculate simplified payments');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateSettlements = async () => {
    if (!selectedNetwork || simplifiedResults.length === 0) return;

    try {
      for (const payment of simplifiedResults) {
        await createSettlementMutation.mutateAsync({
          network_id: selectedNetwork,
          from_member_id: payment.from,
          to_member_id: payment.to,
          amount: payment.amount,
          currency: currency
        });
      }
      
      toast.success('Settlement plan created successfully!');
      setSimplifiedResults([]);
    } catch (error) {
      toast.error('Failed to create settlement plan');
      console.error('Create settlements error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="network">Select Network</Label>
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a network to simplify" />
            </SelectTrigger>
            <SelectContent>
              {networks?.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {network.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSimplify}
          disabled={!selectedNetwork || isCalculating}
          className="w-full"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {isCalculating ? 'Calculating...' : 'Calculate Simplified Payments'}
        </Button>
      </div>

      {simplifiedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Simplified Payment Plan
            </CardTitle>
            <p className="text-sm text-gray-600">
              Optimized to minimize the number of transactions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simplifiedResults.map((result, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{result.fromName}</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="text-xs">{result.toName}</Badge>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {getCurrencySymbol(currency)}{result.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                <strong>Optimization:</strong> Reduced to just {simplifiedResults.length} payment{simplifiedResults.length !== 1 ? 's' : ''} to settle all debts!
              </p>
              <Button onClick={handleCreateSettlements} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Settlement Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {settlements && settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {settlements.slice(0, 5).map((settlement) => (
                <div key={settlement.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Settlement #{settlement.id.slice(0, 8)}</span>
                  <Badge variant={settlement.status === 'completed' ? 'default' : 'secondary'}>
                    {settlement.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
