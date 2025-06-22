
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
      
      // Use raw query to avoid type issues
      const { data, error } = await supabase
        .rpc('select', {
          query: `SELECT * FROM settlegara_notifications ORDER BY created_at DESC`
        });
      
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
        .rpc('update_notification_read_status', {
          notification_id: notificationId
        });
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .rpc('get_unread_notifications_count');
      
      if (error) throw error;
      return data || 0;
    },
  });
};
