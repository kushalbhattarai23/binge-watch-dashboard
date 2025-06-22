
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNetworks, useNetworkMembers } from '@/hooks/useSettleGaraNetworks';
import { useBills, useBillSplits } from '@/hooks/useSettleGaraBills';
import { Calculator, ArrowRight, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Debt {
  from: string;
  to: string;
  amount: number;
}

interface SimplifiedTransaction {
  from: string;
  to: string;
  amount: number;
}

export const SimplifyPage: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [simplifiedTransactions, setSimplifiedTransactions] = useState<SimplifiedTransaction[]>([]);
  
  const { data: networks } = useNetworks();
  const { data: members } = useNetworkMembers(selectedNetwork);
  const { data: bills } = useBills();
  
  const networkBills = bills?.filter(bill => bill.network_id === selectedNetwork) || [];

  const calculateDebts = async (): Promise<Debt[]> => {
    if (!selectedNetwork || !members || members.length < 3) {
      toast.error('At least 3 users are needed to simplify debts');
      return [];
    }

    const debts: Debt[] = [];
    
    // Get all bill splits for this network
    for (const bill of networkBills) {
      // Fetch splits for each bill - in a real app, you'd want to optimize this
      const response = await fetch(`/api/bill-splits/${bill.id}`);
      if (response.ok) {
        const billSplits = await response.json();
        
        // Calculate who owes what for this bill
        const billCreator = bill.created_by;
        billSplits.forEach((split: any) => {
          if (split.status === 'unpaid' && split.member_id !== billCreator) {
            debts.push({
              from: split.member_id,
              to: billCreator,
              amount: Number(split.amount)
            });
          }
        });
      }
    }

    return debts;
  };

  const simplifyDebts = (debts: Debt[]): SimplifiedTransaction[] => {
    // Calculate net balance for each person
    const balances: Record<string, number> = {};
    
    debts.forEach(debt => {
      balances[debt.from] = (balances[debt.from] || 0) - debt.amount;
      balances[debt.to] = (balances[debt.to] || 0) + debt.amount;
    });

    // Separate creditors and debtors
    const creditors: Array<{ id: string; amount: number }> = [];
    const debtors: Array<{ id: string; amount: number }> = [];

    Object.entries(balances).forEach(([id, balance]) => {
      if (balance > 0.01) {
        creditors.push({ id, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ id, amount: -balance });
      }
    });

    // Sort by amount (largest first)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Generate simplified transactions
    const transactions: SimplifiedTransaction[] = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.amount, debtor.amount);

      if (amount > 0.01) {
        transactions.push({
          from: debtor.id,
          to: creditor.id,
          amount: amount
        });
      }

      creditor.amount -= amount;
      debtor.amount -= amount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return transactions;
  };

  const handleSimplify = async () => {
    if (!selectedNetwork) {
      toast.error('Please select a network');
      return;
    }

    if (!members || members.length < 3) {
      toast.error('At least 3 users are needed to simplify debts');
      return;
    }

    try {
      const debts = await calculateDebts();
      const simplified = simplifyDebts(debts);
      setSimplifiedTransactions(simplified);
      
      if (simplified.length === 0) {
        toast.success('No debts to simplify - everyone is settled up!');
      } else {
        toast.success(`Simplified to ${simplified.length} transactions`);
      }
    } catch (error) {
      toast.error('Failed to calculate simplified debts');
      console.error('Simplify error:', error);
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members?.find(m => m.id === memberId);
    return member?.user_name || 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Simplify Debts</h2>
        <p className="text-gray-600">Minimize the number of transactions needed to settle all debts within a network.</p>
      </div>

      {/* Network Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Network</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a network to simplify" />
              </SelectTrigger>
              <SelectContent>
                {networks?.map(network => (
                  <SelectItem key={network.id} value={network.id}>
                    {network.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNetwork && members && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{networkBills.length} bills</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSimplify} 
            disabled={!selectedNetwork || (members && members.length < 3)}
            className="w-full"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Simplified Debts
          </Button>

          {members && members.length < 3 && selectedNetwork && (
            <p className="text-amber-600 text-sm">
              This network needs at least 3 members to use the simplify feature.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Simplified Transactions */}
      {simplifiedTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simplified Transactions</CardTitle>
            <p className="text-sm text-gray-600">
              {simplifiedTransactions.length} transaction{simplifiedTransactions.length !== 1 ? 's' : ''} needed to settle all debts
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simplifiedTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-medium">{getMemberName(transaction.from)}</p>
                      <p className="text-xs text-gray-500">Pays</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600" />
                    <div className="text-center">
                      <p className="font-medium">{getMemberName(transaction.to)}</p>
                      <p className="text-xs text-gray-500">Receives</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Debt Simplification Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>• <strong>Calculates net balances:</strong> Determines who owes money overall and who should receive money</p>
          <p>• <strong>Minimizes transactions:</strong> Instead of everyone paying everyone, it finds the minimum number of transfers needed</p>
          <p>• <strong>Requires 3+ users:</strong> Simplification is most effective with at least 3 people involved</p>
          <p>• <strong>Preserves amounts:</strong> Everyone still pays/receives the same total amount, just with fewer transactions</p>
        </CardContent>
      </Card>
    </div>
  );
};
