
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBills } from '@/hooks/useSettleGaraBills';
import { useBillSplits } from '@/hooks/useSettleGaraBillSplits';
import { useNetworkMembers } from '@/hooks/useSettleBillNetworks';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { ArrowLeft, Receipt, Calendar, Edit, Users, DollarSign } from 'lucide-react';

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const { data: bills } = useBills();
  const { data: splits } = useBillSplits(id || '');
  
  const bill = bills?.find(b => b.id === id);
  const { data: members } = useNetworkMembers(bill?.network_id || '');

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-teal-200 dark:border-teal-800">
            <CardContent className="p-8 text-center">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-teal-300 dark:text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Bill not found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The bill you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => navigate('/settlebill/bills')} className="bg-teal-600 hover:bg-teal-700">
                Back to Bills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalAmount = Number(bill.total_amount);
  const currentUserMember = members?.find(m => m.user_email === user?.email);

  const handleBack = () => {
    navigate('/settlebill/bills');
  };

  const handleEdit = () => {
    navigate(`/settlebill/bills/${id}/edit`);
  };

  // Calculate totals for display
  const totalPaid = splits?.filter(s => s.status === 'paid').reduce((sum, s) => sum + Number(s.amount), 0) || 0;
  const totalOwed = splits?.filter(s => s.status === 'pending').reduce((sum, s) => sum + Number(s.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="flex-shrink-0 hover:bg-teal-100 dark:hover:bg-teal-800">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">{bill.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Added on {new Date(bill.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleEdit} className="border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-900">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Bill Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-teal-200 dark:border-teal-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatAmount(totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(totalPaid)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Owed</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatAmount(totalOwed)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Details */}
        <Card className="border border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Bill Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Title:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{bill.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatAmount(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{bill.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge 
                      variant={bill.status === 'settled' ? 'default' : 'destructive'}
                      className={bill.status === 'settled' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}
                    >
                      {bill.status === 'settled' ? 'Settled' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">People involved:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{splits?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payments made:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{splits?.filter(s => s.status === 'paid').length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending payments:</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">{splits?.filter(s => s.status === 'pending').length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {splits && splits.length > 0 ? (
              <div className="space-y-4">
                {splits.map((split) => {
                  const member = members?.find(m => m.id === split.member_id);
                  const isCurrentUser = member?.user_email === user?.email;
                  const splitAmount = Number(split.amount);
                  const isPaid = split.status === 'paid';
                  
                  return (
                    <div key={split.id} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user_email}`} />
                          <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400">
                            {member?.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {member?.user_name}
                            {isCurrentUser && <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(You)</span>}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isPaid ? 'Paid' : 'Owes'} {formatAmount(splitAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={isPaid ? 'default' : 'destructive'}
                          className={isPaid ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}
                        >
                          {isPaid ? 'Paid' : 'Pending'}
                        </Badge>
                        <p className={`text-lg font-bold mt-1 ${isPaid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                          {formatAmount(splitAmount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-sm md:text-base">No payment details available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes and Comments Section */}
        <Card className="border border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="text-teal-700 dark:text-teal-300">Notes and Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                placeholder="Add a comment about this bill..."
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                rows={3}
              />
              <div className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
