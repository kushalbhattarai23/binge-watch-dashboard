import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBills, useDeleteBill } from '@/hooks/useSettleGaraBills';
import { Receipt, Eye, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const BillsList: React.FC = () => {
  const { data: bills, isLoading, error, refetch } = useBills();
  const deleteBillMutation = useDeleteBill();

  const handleDeleteBill = (billId: string, billTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${billTitle}"? This will also delete all associated splits.`)) {
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

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load bills. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          Retry Loading Bills
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading bills...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bills?.map((bill) => (
          <BillCard 
            key={bill.id} 
            bill={bill} 
            onDelete={handleDeleteBill}
          />
        ))}
      </div>

      {bills?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No bills yet</h3>
          <p className="mb-4">Create your first bill to start tracking shared expenses!</p>
          <Link to="/settlegara/bills/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Your First Bill
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const BillCard: React.FC<{ 
  bill: any; 
  onDelete: (id: string, title: string) => void;
}> = ({ bill, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{bill.title}</CardTitle>
            {bill.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bill.description}</p>
            )}
          </div>
          <Badge variant={bill.status === 'settled' ? 'default' : bill.status === 'pending' ? 'destructive' : 'secondary'}>
            {bill.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(bill.created_at).toLocaleDateString()}
            </span>
          </div>
          <span className="font-semibold text-lg">
            {bill.currency} {Number(bill.total_amount).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/settlegara/bill/${bill.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(bill.id, bill.title)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
