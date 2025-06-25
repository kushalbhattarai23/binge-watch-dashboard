
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useBills } from '@/hooks/useSettleGaraBills';
import { BillEditForm } from '../components/BillEditForm';

export const BillEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bills } = useBills();
  
  const bill = bills?.find(b => b.id === id);

  const handleSuccess = () => {
    navigate(`/settlebill/bills/${id}`);
  };

  const handleClose = () => {
    navigate(`/settlebill/bills/${id}`);
  };

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bill not found</h2>
              <p className="text-gray-600 mb-6">The bill you're trying to edit doesn't exist.</p>
              <Button onClick={() => navigate('/settlebill/bills')}>
                Back to Bills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Bill</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Edit Bill</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Update bill information</p>
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-lg md:text-xl">Edit Bill Information</CardTitle>
            <p className="text-cyan-100 text-sm md:text-base">Update the expense details</p>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <BillEditForm 
              bill={bill}
              onClose={handleClose}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
