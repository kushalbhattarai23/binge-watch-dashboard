
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { NepaliDatePicker } from '@/components/ui/nepali-date-picker';

interface TransactionFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingTransaction: any;
  setEditingTransaction: (transaction: any) => void;
  formData: {
    reason: string;
    type: 'income' | 'expense';
    amount: number;
    wallet_id: string;
    category_id: string;
    date: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  wallets: any[];
  categories: any[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  setIsOpen,
  editingTransaction,
  setEditingTransaction,
  formData,
  setFormData,
  onSubmit,
  wallets,
  categories
}) => {
  const { formatAmount } = useCurrency();

  const handleClose = () => {
    setIsOpen(false);
    setEditingTransaction(null);
    setFormData({
      reason: '',
      type: 'expense',
      amount: 0,
      wallet_id: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDateChange = (englishDate: string, nepaliDate: string) => {
    setFormData({ ...formData, date: englishDate });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Description</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Groceries, Salary"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="wallet">Wallet</Label>
            <Select value={formData.wallet_id} onValueChange={(value) => setFormData({ ...formData, wallet_id: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatAmount(wallet.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <NepaliDatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              required
              id="transaction-date"
            />
          </div>
          
          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
              {editingTransaction ? 'Update' : 'Create'} Transaction
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
