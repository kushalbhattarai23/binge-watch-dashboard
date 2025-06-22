
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Network {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkMember {
  id: string;
  network_id: string;
  user_name: string;
  user_email: string;
  nickname?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useNetworks = () => {
  return useQuery({
    queryKey: ['settlegara-networks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settlegara_networks' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Network[];
    },
  });
};

export const useNetworkMembers = (networkId: string) => {
  return useQuery({
    queryKey: ['settlegara-network-members', networkId],
    queryFn: async () => {
      if (!networkId) return [];
      
      const { data, error } = await supabase
        .from('settlegara_network_members' as any)
        .select('*')
        .eq('network_id', networkId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as NetworkMember[];
    },
    enabled: !!networkId,
  });
};

export const useCreateNetwork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (networkData: Omit<Network, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('settlegara_networks' as any)
        .insert({
          ...networkData,
          creator_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('settlegara_network_members' as any)
        .insert({
          network_id: data.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_email: user.email,
          role: 'admin',
          status: 'active'
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
      }

      return data as Network;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlegara-networks'] });
    },
  });
};

export const useAddNetworkMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (memberData: Omit<NetworkMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('settlegara_network_members' as any)
        .insert(memberData)
        .select()
        .single();
      
      if (error) throw error;
      return data as NetworkMember;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settlegara-network-members', variables.network_id] });
    },
  });
};
