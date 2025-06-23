import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Bill {
  id: string;
  network_id: string;
  title: string;
  description: string | null;
  total_amount: number;
  currency: string;
  created_by: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BillSplit {
  id: string;
  bill_id: string;
  member_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface CreateBillWithSplits {
  bill: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
  splits: Array<{
    member_id: string;
    amount: number;
  }>;
}

export const useBills = () => {
  return useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      console.log('Fetching bills...');
      const { data, error } = await supabase
        .from('settlegara_bills')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bills:', error);
        throw error;
      }
      
      console.log('Bills fetched successfully:', data);
      return data as Bill[];
    },
  });
};

export const useBillSplits = (billId: string) => {
  return useQuery({
    queryKey: ['bill-splits', billId],
    queryFn: async () => {
      console.log('Fetching bill splits for bill:', billId);
      const { data, error } = await supabase
        .from('settlegara_bill_splits')
        .select('*')
        .eq('bill_id', billId);
      
      if (error) {
        console.error('Error fetching bill splits:', error);
        throw error;
      }
      
      console.log('Bill splits fetched successfully:', data);
      return data as BillSplit[];
    },
    enabled: !!billId,
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bill, splits }: CreateBillWithSplits) => {
      console.log('Creating bill with splits...', { bill, splits });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create the bill first
      const { data: billData, error: billError } = await supabase
        .from('settlegara_bills')
        .insert({
          ...bill,
          created_by: user.id
        })
        .select()
        .single();
      
      if (billError) {
        console.error('Error creating bill:', billError);
        throw billError;
      }

      console.log('Bill created successfully:', billData);

      // Create the bill splits
      if (splits && splits.length > 0) {
        const splitsToInsert = splits.map(split => ({
          bill_id: billData.id,
          member_id: split.member_id,
          amount: split.amount,
          status: 'unpaid'
        }));

        const { error: splitsError } = await supabase
          .from('settlegara_bill_splits')
          .insert(splitsToInsert);

        if (splitsError) {
          console.error('Error creating bill splits:', splitsError);
          // Don't fail the whole operation if splits fail
        } else {
          console.log('Bill splits created successfully');
        }
      }

      return billData;
    },
    onSuccess: () => {
      console.log('Bill creation success, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
    onError: (error) => {
      console.error('Bill creation failed:', error);
    },
  });
};

export const useUpdateBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bill> & { id: string }) => {
      const { data, error } = await supabase
        .from('settlegara_bills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billId: string) => {
      const { error } = await supabase
        .from('settlegara_bills')
        .delete()
        .eq('id', billId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useCreateBillSplit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (split: Omit<BillSplit, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('settlegara_bill_splits')
        .insert(split)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bill-splits', data.bill_id] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useUpdateBillSplit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BillSplit> & { id: string }) => {
      const { data, error } = await supabase
        .from('settlegara_bill_splits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bill-splits', data.bill_id] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};
