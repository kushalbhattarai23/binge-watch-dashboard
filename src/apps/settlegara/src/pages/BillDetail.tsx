
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBills, useBillSplits, useCreateBillSplit, useUpdateBillSplit } from '@/hooks/useSettleGaraBills';
import { useNetworkMembers } from '@/hooks/useSettleGaraNetworks';
import { ArrowLeft, Users, DollarSign, Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export const BillDetail: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({});

  const { data: bills } = useBills();
  const bill = bills?.find(b => b.id === billId);
  const { data: splits } = useBillSplits(billId || '');
  const { data: members } = useNetworkMembers(bill?.network_id || '');
  const createSplitMutation = useCreateBillSplit();
  const updateSplitMutation = useUpdateBillSplit();

  if (!bill) {
    return <div className="text-center py-8">Bill not found</div>;
  }

  const totalSplitAmount = splits?.reduce((sum, split) => sum + Number(split.amount), 0) || 0;
  const remainingAmount = Number(bill.total_amount) - totalSplitAmount;
  const canSettle = splits && splits.length >= 2;

  const handleCreateSplits = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    const totalAssigned = Object.values(splitAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
    if (Math.abs(totalAssigned - Number(bill.total_amount)) > 0.01) {
      toast.error('Total split amounts must equal the bill amount');
      return;
    }

    selectedMembers.forEach(memberId => {
      const amount = splitAmounts[memberId];
      if (amount && amount > 0) {
        createSplitMutation.mutate({
          bill_id: bill.id,
          member_id: memberId,
          amount: amount,
          status: 'unpaid'
        });
      }
    });

    setShowSplitForm(false);
    setSelectedMembers([]);
    setSplitAmounts({});
    toast.success('Bill splits created successfully');
  };

  const handleEqualSplit = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select members first');
      return;
    }

    const amountPerPerson = Number(bill.total_amount) / selectedMembers.length;
    const newSplitAmounts: Record<string, number> = {};
    selectedMembers.forEach(memberId => {
      newSplitAmounts[memberId] = amountPerPerson;
    });
    setSplitAmounts(newSplitAmounts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settlegara/bills')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{bill.title}</h2>
          <p className="text-gray-600">Bill Details</p>
        </div>
      </div>

      {/* Bill Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Bill Information
            <Badge variant={bill.status === 'settled' ? 'default' : 'destructive'}>
              {bill.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Amount</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xl font-semibold">${Number(bill.total_amount).toFixed(2)}</span>
                <span className="text-sm text-gray-500">{bill.currency}</span>
              </div>
            </div>
            <div>
              <Label>Created</Label>
              <p className="mt-1">{new Date(bill.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          {bill.description && (
            <div>
              <Label>Description</Label>
              <p className="mt-1 text-gray-700">{bill.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill Splits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bill Splits
          </CardTitle>
          {!showSplitForm && splits && splits.length === 0 && (
            <Button onClick={() => setShowSplitForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Split Bill
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showSplitForm ? (
            <div className="space-y-4">
              <div>
                <Label>Select Members</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {members?.map(member => (
                    <label key={member.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, member.id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                            const newAmounts = { ...splitAmounts };
                            delete newAmounts[member.id];
                            setSplitAmounts(newAmounts);
                          }
                        }}
                      />
                      <span>{member.user_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedMembers.length > 0 && (
                <>
                  <Button onClick={handleEqualSplit} variant="outline" size="sm">
                    Split Equally
                  </Button>

                  <div className="space-y-3">
                    {selectedMembers.map(memberId => {
                      const member = members?.find(m => m.id === memberId);
                      return (
                        <div key={memberId} className="flex items-center gap-3">
                          <Label className="w-24">{member?.user_name}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={splitAmounts[memberId] || ''}
                            onChange={(e) => setSplitAmounts({
                              ...splitAmounts,
                              [memberId]: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Total Assigned:</span>
                    <span className="font-semibold">
                      ${Object.values(splitAmounts).reduce((sum, amount) => sum + (amount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateSplits} disabled={createSplitMutation.isPending}>
                  <Check className="w-4 h-4 mr-2" />
                  Create Splits
                </Button>
                <Button variant="outline" onClick={() => setShowSplitForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : splits && splits.length > 0 ? (
            <div className="space-y-3">
              {splits.map(split => {
                const member = members?.find(m => m.id === split.member_id);
                return (
                  <div key={split.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member?.user_name}</p>
                      <p className="text-sm text-gray-600">{member?.user_email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${Number(split.amount).toFixed(2)}</span>
                      <Badge variant={split.status === 'paid' ? 'default' : 'destructive'}>
                        {split.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              
              {!canSettle && (
                <div className="text-center py-4 text-amber-600">
                  <p>At least 2 users must be involved to settle this bill</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No splits created yet. Split this bill among network members!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
