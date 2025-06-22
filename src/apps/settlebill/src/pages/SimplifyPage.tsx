
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SimplifyBillsForm } from '../components/SimplifyBillsForm';

export const SimplifyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/settlebill/networks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Simplify Bills</h1>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Bill Simplification
            </CardTitle>
            <p className="text-purple-100">Optimize payments and reduce the number of transactions needed</p>
          </CardHeader>
          <CardContent className="p-6">
            <SimplifyBillsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
