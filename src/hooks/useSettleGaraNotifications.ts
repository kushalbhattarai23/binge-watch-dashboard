
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_email: string;
  title: string;
  message: string;
  type: 'member_added' | 'bill_added' | 'invitation' | 'payment_reminder';
  network_id: string | null;
  bill_id: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['settlegara-notifications'],
    queryFn: async () => {
      console.log('Fetching SettleGara notifications...');
      
      // Use type assertion to work around Supabase type limitations
      const { data, error } = await supabase
        .from('settlegara_notifications' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      console.log('Notifications fetched successfully:', data);
      return (data || []) as Notification[];
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('settlegara_notifications' as any)
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlegara-notifications'] });
    },
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['settlegara-notifications-unread-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('settlegara_notifications' as any)
        .select('*', { count: 'exact', head: true })
        .eq('read', false);
      
      if (error) throw error;
      return count || 0;
    },
  });
};
