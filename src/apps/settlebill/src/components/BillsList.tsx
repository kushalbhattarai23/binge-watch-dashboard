
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Calendar, DollarSign, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBills, useDeleteBill, useUpdateBill } from '@/hooks/useSettleGaraBills';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from 'sonner';

export const BillsList: React.FC = () => {
  const { data: bills, isLoading } = useBills();
  const { data: userPreferences } = useUserPreferences();
  const deleteBillMutation = useDeleteBill();
  const updateBillMutation = useUpdateBill();

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

  const handleDelete = (billId: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBillMutation.mutate(billId, {
        onSuccess: () => {
          toast.success('Bill deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete bill');
        }
      });
    }
  };

  const handleMarkAsSettled = (billId: string) => {
    updateBillMutation.mutate(
      { id: billId, status: 'settled' },
      {
        onSuccess: () => {
          toast.success('Bill marked as settled');
        },
        onError: () => {
          toast.error('Failed to update bill status');
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!bills || bills.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
        <p className="text-gray-500 mb-6">Create your first bill to start tracking expenses</p>
        <Link to="/settlebill/bills/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create Bill
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card key={bill.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" />
                  {bill.title}
                </CardTitle>
                {bill.description && (
                  <p className="text-gray-600 mt-1">{bill.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {bill.status !== 'settled' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMarkAsSettled(bill.id)}
                    disabled={updateBillMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <Link to={`/settlebill/bills/${bill.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(bill.id)}
                  disabled={deleteBillMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {getCurrencySymbol(currency)} {bill.total_amount.toFixed(2)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(bill.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge className={getStatusColor(bill.status)}>
                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
