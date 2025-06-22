
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNetworks } from '@/hooks/useSettleGaraNetworks';
import { Calculator, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

export const SimplifyBillsForm: React.FC = () => {
  const { data: networks } = useNetworks();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [simplificationResults, setSimplificationResults] = useState<any[]>([]);

  const handleSimplify = async () => {
    if (!selectedNetwork) {
      toast.error('Please select a network');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulate calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = [
        { from: 'Alice', to: 'Bob', amount: 25.50 },
        { from: 'Charlie', to: 'Alice', amount: 12.25 },
        { from: 'Bob', to: 'Charlie', amount: 8.75 }
      ];
      
      setSimplificationResults(mockResults);
      toast.success('Bills simplified successfully');
    } catch (error) {
      console.error('Error simplifying bills:', error);
      toast.error('Failed to simplify bills');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Simplify Network Bills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Network</label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a network to simplify" />
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

          <Button 
            onClick={handleSimplify}
            disabled={!selectedNetwork || isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Simplify Bills'}
          </Button>
        </CardContent>
      </Card>

      {simplificationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Simplified Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simplificationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{result.from}</span>
                    <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{result.to}</span>
                  </div>
                  <span className="font-bold text-green-600">${result.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
