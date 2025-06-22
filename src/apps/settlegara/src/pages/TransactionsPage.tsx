
import React from 'react';
import { Button } from '@/components/ui/button';
import { TransactionForm } from '../components/TransactionForm';
import { Plus } from 'lucide-react';

interface TransactionsPageProps {
  showTransactionForm: boolean;
  onShowTransactionForm: () => void;
  onCloseTransactionForm: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  showTransactionForm,
  onShowTransactionForm,
  onCloseTransactionForm
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Button onClick={onShowTransactionForm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>
      
      {showTransactionForm && (
        <TransactionForm onClose={onCloseTransactionForm} />
      )}
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-lg text-center border border-settlegara-primary/20">
        <p className="text-lg text-gray-600 dark:text-gray-300">Transaction history coming soon...</p>
      </div>
    </div>
  );
};
