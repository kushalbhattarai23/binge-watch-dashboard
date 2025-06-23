
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
import { ArrowLeft, Receipt, Calendar, Edit } from 'lucide-react';

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currency, formatAmount } = useCurrency();
  const { data: bills } = useBills();
  const { data: splits } = useBillSplits(id || '');
  
  const bill = bills?.find(b => b.id === id);
  const { data: members } = useNetworkMembers(bill?.network_id || '');

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 md:p-6">
        <div className="text-center py-8">Bill not found</div>
      </div>
    );
  }

  const totalAmount = Number(bill.total_amount);
  const currentUserMember = members?.find(m => m.user_email === user?.email);

  const handleBack = () => {
    navigate('/settlebill/bills');
  };

  // Get the person who created/paid the bill
  const billCreator = members?.find(m => m.user_email === user?.email); // This would need to be improved to get actual creator

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{bill.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Added on {new Date(bill.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit expense
          </Button>
        </div>

        {/* Bill Amount Card */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Receipt className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {bill.title}
                </h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatAmount(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            {splits && splits.length > 0 ? (
              <div className="space-y-4">
                {splits.map((split) => {
                  const member = members?.find(m => m.id === split.member_id);
                  const isCurrentUser = member?.user_email === user?.email;
                  const splitAmount = Number(split.amount);
                  const isPaid = split.status === 'paid';
                  
                  return (
                    <div key={split.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user_email}`} />
                          <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
                            {member?.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {member?.user_name} {isPaid ? 'paid' : 'owes'} {formatAmount(splitAmount)}
                            {!isPaid && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                and owes {formatAmount(splitAmount)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isPaid ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            you paid
                          </span>
                        ) : (
                          <span className="text-orange-600 dark:text-orange-400 font-bold">
                            {formatAmount(splitAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Settlement Status */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                  <div className="text-center">
                    <Badge 
                      variant={bill.status === 'settled' ? 'default' : 'destructive'}
                      className="text-sm px-4 py-2"
                    >
                      {bill.status === 'settled' ? 'Settled' : 'Not settled'}
                    </Badge>
                  </div>
                </div>
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
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
              Notes and Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                placeholder="Add a comment"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
