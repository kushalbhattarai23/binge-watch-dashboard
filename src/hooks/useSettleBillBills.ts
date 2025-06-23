
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

export const useBills = () => {
  return useQuery({
    queryKey: ['settlebill-bills'],
    queryFn: async () => {
      console.log('Fetching SettleBill bills...');
      const { data, error } = await supabase
        .from('settlebill_bills')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bills:', error);
        throw error;
      }
      
      console.log('SettleBill bills fetched successfully:', data);
      return data as Bill[];
    },
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bill: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      console.log('Creating SettleBill bill...', bill);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('settlebill_bills')
        .insert({
          ...bill,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bill:', error);
        throw error;
      }

      console.log('SettleBill bill created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Bill creation success, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['settlebill-bills'] });
    },
    onError: (error) => {
      console.error('Bill creation failed:', error);
    },
  });
};
