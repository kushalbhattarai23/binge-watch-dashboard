
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  onClose?: () => void;
  onSubmit?: (data: TransactionData) => void;
}

interface TransactionData {
  day: string;
  nepaliDate: string;
  englishDate: Date | null;
  income: number;
  expense: number;
  reason: string;
  paymentType: 'CASH' | 'ESEWA' | 'KHALTI' | 'LAXMIBANK';
  wallet: string;
  total: number;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TransactionData>({
    day: '',
    nepaliDate: '',
    englishDate: null,
    income: 0,
    expense: 0,
    reason: '',
    paymentType: 'CASH',
    wallet: '',
    total: 0
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    const updatedData = { ...formData, [field]: value };
    
    // Calculate total automatically
    if (field === 'income' || field === 'expense') {
      updatedData.total = (updatedData.income || 0) - (updatedData.expense || 0);
    }
    
    setFormData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.day || !formData.nepaliDate || !formData.englishDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Day, Nepali Date, English Date)",
        variant: "destructive"
      });
      return;
    }

    if (formData.income === 0 && formData.expense === 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter either income or expense amount",
        variant: "destructive"
      });
      return;
    }

    console.log('Transaction Data:', formData);
    
    toast({
      title: "Transaction Added",
      description: "Your transaction has been recorded successfully",
    });

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({
      day: '',
      nepaliDate: '',
      englishDate: null,
      income: 0,
      expense: 0,
      reason: '',
      paymentType: 'CASH',
      wallet: '',
      total: 0
    });
  };

  const paymentTypes = [
    { value: 'CASH', label: 'Cash' },
    { value: 'ESEWA', label: 'eSewa' },
    { value: 'KHALTI', label: 'Khalti' },
    { value: 'LAXMIBANK', label: 'Laxmi Bank' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl text-settlegara-primary">Add Transaction</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day *</Label>
              <Input
                id="day"
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                placeholder="e.g., Sunday"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nepaliDate">Nepali Date *</Label>
              <Input
                id="nepaliDate"
                value={formData.nepaliDate}
                onChange={(e) => handleInputChange('nepaliDate', e.target.value)}
                placeholder="e.g., 2081/03/15"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>English Date *</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.englishDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.englishDate ? format(formData.englishDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.englishDate || undefined}
                    onSelect={(date) => {
                      handleInputChange('englishDate', date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Amount Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Income (Rs.)</Label>
              <Input
                id="income"
                type="number"
                step="0.01"
                min="0"
                value={formData.income || ''}
                onChange={(e) => handleInputChange('income', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense">Expense (Rs.)</Label>
              <Input
                id="expense"
                type="number"
                step="0.01"
                min="0"
                value={formData.expense || ''}
                onChange={(e) => handleInputChange('expense', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total (Rs.)</Label>
              <Input
                id="total"
                type="number"
                value={formData.total}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Reason/Description */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason/Description</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Add details about this transaction..."
              rows={3}
            />
          </div>

          {/* Payment Type and Wallet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value) => handleInputChange('paymentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet/Account</Label>
              <Input
                id="wallet"
                value={formData.wallet}
                onChange={(e) => handleInputChange('wallet', e.target.value)}
                placeholder="e.g., Main Cash, eSewa Account"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-settlegara-primary hover:bg-settlegara-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
