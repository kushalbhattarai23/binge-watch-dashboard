
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillForm } from '../components/BillForm';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CreateBillPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/settlebill/bills');
  };

  const handleClose = () => {
    navigate('/settlebill/bills');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/settlebill/bills">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bills
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Bill</h1>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Bill Information</CardTitle>
            <p className="text-blue-100">Add a new expense to split among your network members</p>
          </CardHeader>
          <CardContent className="p-6">
            <BillForm 
              onClose={handleClose}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
