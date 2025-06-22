
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BillSplit {
  id: string;
  bill_id: string;
  member_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export const useBillSplits = (billId: string) => {
  return useQuery({
    queryKey: ['bill-splits', billId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settlegara_bill_splits')
        .select('*')
        .eq('bill_id', billId);
      
      if (error) throw error;
      return data as BillSplit[];
    },
    enabled: !!billId,
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
