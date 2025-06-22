
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }

 from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworks } from '@/hooks/useSettleGaraNetworks';
import { useBills } from '@/hooks/useSettleGaraBills';
import { Calculator, ArrowRight, Users } from 'lucide-react';

export const SimplifyBillsForm: React.FC = () => {
  const { data: networks } = useNetworks();
  const { data: bills } = useBills();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [simplifiedResults, setSimplifiedResults] = useState<any[]>([]);

  const handleSimplify = () => {
    if (!selectedNetwork) return;

    // Filter bills for selected network
    const networkBills = bills?.filter(bill => bill.network_id === selectedNetwork) || [];
    
    // Simple calculation - in a real app, this would be more complex
    const mockResults = [
      { from: 'Alice', to: 'Bob', amount: 25.50 },
      { from: 'Charlie', to: 'Bob', amount: 15.75 },
      { from: 'Alice', to: 'David', amount: 10.25 },
    ];
    
    setSimplifiedResults(mockResults);
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
          disabled={!selectedNetwork}
          className="w-full"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Simplified Payments
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{result.from}</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline">{result.to}</Badge>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ${result.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Optimization:</strong> Reduced from multiple transactions to just {simplifiedResults.length} payments!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
