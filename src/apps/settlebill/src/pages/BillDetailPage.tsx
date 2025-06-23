
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
import { ArrowLeft, Receipt, DollarSign, Users, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: bills } = useBills();
  const { data: splits } = useBillSplits(id || '');
  
  const bill = bills?.find(b => b.id === id);
  const { data: members } = useNetworkMembers(bill?.network_id || '');

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4 md:p-6">
        <div className="text-center py-8">Bill not found</div>
      </div>
    );
  }

  // Calculate totals and user-specific amounts
  const totalAmount = Number(bill.total_amount);
  const totalSplitAmount = splits?.reduce((sum, split) => sum + Number(split.amount), 0) || 0;
  const currentUserMember = members?.find(m => m.user_email === user?.email);
  const currentUserSplit = splits?.find(s => s.member_id === currentUserMember?.id);
  const currentUserAmount = currentUserSplit ? Number(currentUserSplit.amount) : 0;
  const currentUserOwes = currentUserSplit?.status === 'unpaid' ? currentUserAmount : 0;

  // Calculate network-wide totals for the current user
  const allUserSplits = splits?.filter(s => s.member_id === currentUserMember?.id) || [];
  const totalUserOwes = allUserSplits
    .filter(s => s.status === 'unpaid')
    .reduce((sum, split) => sum + Number(split.amount), 0);

  const handleBack = () => {
    navigate('/settlebill/bills');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{bill.title}</h1>
            <p className="text-gray-600 text-sm md:text-base">Bill Details</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">${totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Bill total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Share</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">${currentUserAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Your portion
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">You Owe</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-red-600">${currentUserOwes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Outstanding amount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bill Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                Bill Information
              </span>
              <Badge variant={bill.status === 'settled' ? 'default' : 'destructive'}>
                {bill.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created Date</p>
                <p className="text-base md:text-lg">{new Date(bill.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Currency</p>
                <p className="text-base md:text-lg">{bill.currency || 'USD'}</p>
              </div>
            </div>
            {bill.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-700 mt-1 text-sm md:text-base">{bill.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill Splits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="w-5 h-5 text-teal-600" />
              Bill Splits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {splits && splits.length > 0 ? (
              <div className="space-y-3">
                {splits.map((split) => {
                  const member = members?.find(m => m.id === split.member_id);
                  const isCurrentUser = member?.user_email === user?.email;
                  return (
                    <div key={split.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg bg-white space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="flex-shrink-0">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user_email}`} />
                          <AvatarFallback>{member?.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm md:text-base">
                            {member?.user_name} {isCurrentUser && '(You)'}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 truncate">{member?.user_email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-base md:text-lg">${Number(split.amount).toFixed(2)}</p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {((Number(split.amount) / totalAmount) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                        <Badge variant={split.status === 'paid' ? 'default' : 'destructive'} className="text-xs">
                          {split.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                    <span className="font-semibold text-sm md:text-base">Total Split:</span>
                    <span className="font-bold text-base md:text-lg">${totalSplitAmount.toFixed(2)}</span>
                  </div>
                  {Math.abs(totalSplitAmount - totalAmount) > 0.01 && (
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg mt-2">
                      <span className="font-semibold text-amber-700 text-sm md:text-base">Remaining:</span>
                      <span className="font-bold text-base md:text-lg text-amber-700">
                        ${(totalAmount - totalSplitAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm md:text-base">No splits created yet.</p>
                <p className="text-xs md:text-sm">This bill hasn't been split among members yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
