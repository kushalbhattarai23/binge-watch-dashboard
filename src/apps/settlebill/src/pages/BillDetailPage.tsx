
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt, DollarSign } from 'lucide-react';

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/settlebill/bills">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bills
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Bill Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Bill detail page for ID: {id}</p>
            <p className="text-sm text-gray-500 mt-2">This page would show detailed bill information, splits, and payment status.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
