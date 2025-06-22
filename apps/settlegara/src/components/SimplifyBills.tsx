
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Calculator, DollarSign } from 'lucide-react';
import { sampleBills, sampleUsers } from '../data/sampleData';
import { Settlement } from '../types';

export const SimplifyBills: React.FC = () => {
  const [simplified, setSimplified] = useState<Settlement[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSimplifiedSettlements = () => {
    setIsCalculating(true);
    
    // Simple debt calculation algorithm
    const balances: { [userId: string]: number } = {};
    
    // Calculate net balance for each user
    sampleBills.forEach(bill => {
      if (!bill.settled) {
        bill.participants.forEach(participant => {
          if (!balances[participant.userId]) {
            balances[participant.userId] = 0;
          }
          balances[participant.userId] += participant.paid - participant.amount;
        });
      }
    });

    // Create settlements to minimize transactions
    const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0);
    const debtors = Object.entries(balances).filter(([_, balance]) => balance < 0);
    
    const settlements: Settlement[] = [];
    
    creditors.forEach(([creditorId, creditAmount]) => {
      debtors.forEach(([debtorId, debtAmount]) => {
        if (creditAmount > 0 && debtAmount < 0) {
          const settlementAmount = Math.min(creditAmount, Math.abs(debtAmount));
          if (settlementAmount > 0.01) { // Avoid very small amounts
            settlements.push({
              from: debtorId,
              to: creditorId,
              amount: settlementAmount
            });
            
            // Update balances
            balances[creditorId] -= settlementAmount;
            balances[debtorId] += settlementAmount;
          }
        }
      });
    });

    setTimeout(() => {
      setSimplified(settlements);
      setIsCalculating(false);
    }, 1000);
  };

  const getUserById = (id: string) => sampleUsers.find(user => user.id === id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Bill Simplification
          </CardTitle>
          <p className="text-sm text-gray-600">
            Reduce the number of transactions needed to settle all debts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold">Current Unsettled Bills</h3>
              <p className="text-sm text-gray-600">
                {sampleBills.filter(b => !b.settled).length} bills with multiple transactions
              </p>
            </div>
            <Button 
              onClick={calculateSimplifiedSettlements} 
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {isCalculating ? 'Calculating...' : 'Simplify'}
            </Button>
          </div>

          {simplified.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-green-700">Simplified Settlements</h3>
              <div className="grid gap-3">
                {simplified.map((settlement, index) => {
                  const fromUser = getUserById(settlement.from);
                  const toUser = getUserById(settlement.to);
                  
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={fromUser?.avatar} />
                            <AvatarFallback>{fromUser?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{fromUser?.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                            <DollarSign className="w-4 h-4 text-red-600" />
                            <span className="font-semibold text-red-600">
                              ${settlement.amount.toFixed(2)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-medium">{toUser?.name}</span>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={toUser?.avatar} />
                            <AvatarFallback>{toUser?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Simplified!</strong> Instead of multiple transactions, 
                  only {simplified.length} payment{simplified.length !== 1 ? 's' : ''} needed 
                  to settle all debts.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
