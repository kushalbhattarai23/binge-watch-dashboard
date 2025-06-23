import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNetworks, useNetworkMembers } from '@/hooks/useSettleBillNetworks';
import { useBills, useBillSplits } from '@/hooks/useSettleGaraBills';
import { useCreateSettlement, useSettlements } from '@/hooks/useSettlements';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, ArrowRight, Users, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface SimplifiedPayment {
  from: string;
  to: string;
  amount: number;
  fromName: string;
  toName: string;
}

interface NetworkSettlement {
  from_member: string;
  to_member: string;
  amount: number;
  from_member_name?: string;
  to_member_name?: string;
}

export const SimplifyBillsForm: React.FC = () => {
  const { data: networks } = useNetworks();
  const { data: bills } = useBills();
  const { data: userPreferences } = useUserPreferences();
  const createSettlementMutation = useCreateSettlement();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [simplifiedResults, setSimplifiedResults] = useState<SimplifiedPayment[]>([]);
  const [networkSettlements, setNetworkSettlements] = useState<NetworkSettlement[]>([]);
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
      // Call the database function
      const { data: functionResult, error: functionError } = await supabase
        .rpc('simplify_network_settlements', { network_uuid: selectedNetwork });

      if (functionError) {
        console.error('Database function error:', functionError);
        toast.error('Failed to calculate simplified payments from database');
        setIsCalculating(false);
        return;
      }

      console.log('Database function result:', functionResult);
      
      if (functionResult && functionResult.length > 0) {
        // Store the raw database results
        setNetworkSettlements(functionResult);
        
        // Convert to the existing format for backward compatibility
        const convertedResults = functionResult.map((result: NetworkSettlement) => ({
          from: result.from_member,
          to: result.to_member,
          amount: Number(result.amount),
          fromName: result.from_member_name || 'Unknown Member',
          toName: result.to_member_name || 'Unknown Member'
        }));
        
        setSimplifiedResults(convertedResults);
        toast.success(`Calculated ${convertedResults.length} optimized transactions from database`);
      } else {
        setNetworkSettlements([]);
        setSimplifiedResults([]);
        toast.info('No settlements needed - all debts are settled!');
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
      setNetworkSettlements([]);
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

      {/* Database Function Results Display */}
      {networkSettlements.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <DollarSign className="w-5 h-5" />
              Network Settlement Results (Database Function)
            </CardTitle>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Results from simplify_network_settlements function - {networkSettlements.length} settlement{networkSettlements.length !== 1 ? 's' : ''} calculated
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Member</TableHead>
                    <TableHead>To Member</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkSettlements.map((settlement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700">
                          {settlement.from_member_name || settlement.from_member}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700">
                            {settlement.to_member_name || settlement.to_member}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {getCurrencySymbol(currency)}{Number(settlement.amount).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-300 dark:border-blue-600">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Database Optimization Complete!
                  </p>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  This plan eliminates all debts with {networkSettlements.length} optimized payment{networkSettlements.length !== 1 ? 's' : ''} calculated by the database function.
                </p>
                <Button onClick={handleCreateSettlements} className="w-full bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Settlement Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legacy Results Display (keeping for compatibility) */}
      {simplifiedResults.length > 0 && networkSettlements.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Optimized Payment Plan (Legacy)
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

      {/* Recent Settlements Display */}
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
