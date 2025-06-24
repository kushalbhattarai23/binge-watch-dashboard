
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { SimplifyBillsForm } from '../components/SimplifyBillsForm';

export const SimplifyPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Simplify Bills</h1>
          <p className="text-gray-600">Optimize payments and reduce the number of transactions needed</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Bill Simplification
            </CardTitle>
            <p className="text-rose-100">Optimize payments and reduce the number of transactions needed</p>
          </CardHeader>
          <CardContent className="p-6">
            <SimplifyBillsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
