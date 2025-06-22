
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Network {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkMember {
  id: string;
  network_id: string;
  user_email: string;
  user_name: string;
  role: string;
  status: string;
  joined_at: string;
}

export const useNetworks = () => {
  return useQuery({
    queryKey: ['networks'],
    queryFn: async () => {
      console.log('Fetching networks...');
      const { data, error } = await supabase
        .from('settlegara_networks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching networks:', error);
        throw error;
      }
      
      console.log('Networks fetched successfully:', data);
      return data as Network[];
    },
  });
};

export const useNetworkMembers = (networkId: string) => {
  return useQuery({
    queryKey: ['network-members', networkId],
    queryFn: async () => {
      console.log('Fetching network members for network:', networkId);
      const { data, error } = await supabase
        .from('settlegara_network_members')
        .select('*')
        .eq('network_id', networkId);
      
      if (error) {
        console.error('Error fetching network members:', error);
        throw error;
      }
      
      console.log('Network members fetched successfully:', data);
      return data as NetworkMember[];
    },
    enabled: !!networkId,
  });
};

export const useCreateNetwork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (network: Omit<Network, 'id' | 'created_at' | 'updated_at' | 'creator_id'>) => {
      console.log('Creating network mutation started...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        throw new Error('Not authenticated');
      }

      console.log('User authenticated, creating network:', { ...network, creator_id: user.id });
      
      const { data, error } = await supabase
        .from('settlegara_networks')
        .insert({
          ...network,
          creator_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Network creation error:', error);
        throw error;
      }
      
      console.log('Network created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Network creation success, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
    onError: (error) => {
      console.error('Network creation failed:', error);
    },
  });
};

export const useUpdateNetwork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Network> & { id: string }) => {
      const { data, error } = await supabase
        .from('settlegara_networks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};

export const useDeleteNetwork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (networkId: string) => {
      const { error } = await supabase
        .from('settlegara_networks')
        .delete()
        .eq('id', networkId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};

export const useAddNetworkMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (member: Omit<NetworkMember, 'id' | 'joined_at'>) => {
      const { data, error } = await supabase
        .from('settlegara_network_members')
        .insert(member)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['network-members', data.network_id] });
    },
  });
};

export const useRemoveNetworkMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ memberId, networkId }: { memberId: string; networkId: string }) => {
      const { error } = await supabase
        .from('settlegara_network_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      return { memberId, networkId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['network-members', data.networkId] });
    },
  });
};
