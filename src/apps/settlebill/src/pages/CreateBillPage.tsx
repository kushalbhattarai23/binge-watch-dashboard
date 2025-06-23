
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillForm } from '../components/BillForm';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CreateBillPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const networkId = searchParams.get('networkId');

  const handleSuccess = () => {
    navigate('/settlebill/bills');
  };

  const handleClose = () => {
    navigate('/settlebill/bills');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <Link to="/settlebill/bills">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Bills</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Create New Bill</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Split expenses with your network members</p>
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-lg md:text-xl">Bill Information</CardTitle>
            <p className="text-cyan-100 text-sm md:text-base">Add a new expense to split among your network members</p>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <BillForm 
              onClose={handleClose}
              onSuccess={handleSuccess}
              selectedNetworkId={networkId || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
