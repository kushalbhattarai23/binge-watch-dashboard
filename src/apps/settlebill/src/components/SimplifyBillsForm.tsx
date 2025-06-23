
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
    console.log('Starting debt simplification process...');

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

      // Calculate debts from bills (simplified equal split for now)
      networkBills.forEach(bill => {
        const splitAmount = Number(bill.total_amount) / members.length;
        
        // Find who created/paid the bill
        const payer = members.find(m => m.user_email === bill.created_by);
        if (payer) {
          // The payer is owed (total - their share)
          balances[payer.id] += Number(bill.total_amount) - splitAmount;
        }
        
        // Everyone else owes their share
        members.forEach(member => {
          if (member.id !== payer?.id) {
            balances[member.id] -= splitAmount;
          }
        });
      });

      console.log('Initial balances:', balances);

      // Implement debt optimization algorithm
      // The goal is to minimize transactions by finding direct settlements
      const optimizedPayments = optimizeDebts(balances, members);
      
      console.log('Optimized payments:', optimizedPayments);
      setSimplifiedResults(optimizedPayments);
      
      if (optimizedPayments.length > 0) {
        toast.success(`Calculated ${optimizedPayments.length} optimized transactions`);
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

  // Debt optimization algorithm
  const optimizeDebts = (balances: { [memberId: string]: number }, members: any[]): SimplifiedPayment[] => {
    const payments: SimplifiedPayment[] = [];
    const memberMap = new Map(members.map(m => [m.id, m]));
    
    // Create arrays of creditors (positive balance) and debtors (negative balance)
    let creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0.01)
      .map(([id, balance]) => ({ id, balance }))
      .sort((a, b) => b.balance - a.balance);
    
    let debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < -0.01)
      .map(([id, balance]) => ({ id, balance: Math.abs(balance) }))
      .sort((a, b) => b.balance - a.balance);
    
    console.log('Creditors:', creditors);
    console.log('Debtors:', debtors);

    // Greedy algorithm to minimize transactions
    while (creditors.length > 0 && debtors.length > 0) {
      const creditor = creditors[0];
      const debtor = debtors[0];
      
      // Calculate settlement amount (minimum of what creditor is owed and debtor owes)
      const settlementAmount = Math.min(creditor.balance, debtor.balance);
      
      if (settlementAmount <= 0.01) break;
      
      const creditorMember = memberMap.get(creditor.id);
      const debtorMember = memberMap.get(debtor.id);
      
      if (creditorMember && debtorMember) {
        payments.push({
          from: debtor.id,
          to: creditor.id,
          amount: Number(settlementAmount.toFixed(2)),
          fromName: debtorMember.user_name,
          toName: creditorMember.user_name
        });
      }
      
      // Update balances
      creditor.balance -= settlementAmount;
      debtor.balance -= settlementAmount;
      
      // Remove fully settled parties
      if (creditor.balance <= 0.01) {
        creditors.shift();
      }
      if (debtor.balance <= 0.01) {
        debtors.shift();
      }
    }
    
    return payments;
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
              Optimized Payment Plan
            </CardTitle>
            <p className="text-sm text-gray-600">
              Minimized transactions using direct debt settlements - {simplifiedResults.length} payment{simplifiedResults.length !== 1 ? 's' : ''} required
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simplifiedResults.map((result, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700 space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-medium bg-white dark:bg-gray-800">
                      {result.fromName}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="text-xs font-medium bg-white dark:bg-gray-800">
                      {result.toName}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {getCurrencySymbol(currency)}{result.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border border-green-300 dark:border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Debt Optimization Complete!
                </p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                This plan eliminates all debts with just {simplifiedResults.length} direct payment{simplifiedResults.length !== 1 ? 's' : ''}, 
                avoiding unnecessary intermediate transactions.
              </p>
              <Button onClick={handleCreateSettlements} className="w-full bg-green-600 hover:bg-green-700">
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
                <div key={settlement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Settlement #{settlement.id.slice(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrencySymbol(settlement.currency)}{Number(settlement.amount).toFixed(2)}
                    </span>
                    <Badge variant={settlement.status === 'completed' ? 'default' : 'secondary'}>
                      {settlement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
