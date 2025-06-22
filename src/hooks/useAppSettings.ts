
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AppSettings {
  enabledApps: {
    public: boolean;
    movies: boolean;
    tvShows: boolean;
    finance: boolean;
    settlebill: boolean;
    admin: boolean;
  };
}

const defaultSettings: AppSettings = {
  enabledApps: {
    public: true,
    movies: true,
    tvShows: true,
    finance: true,
    settlebill: true,
    admin: false, // Admin disabled by default
  }
};

export const useAppSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch user app preferences from database
  const { data: dbSettings, isLoading } = useQuery({
    queryKey: ['user-app-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user app preferences for user:', user.id);
      const { data, error } = await supabase
        .from('user_app_preferences')
        .select('app_name, enabled')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user app preferences:', error);
        throw error;
      }

      console.log('Fetched app preferences:', data);
      return data;
    },
    enabled: !!user,
  });

  // Convert database format to AppSettings format
  const settings: AppSettings = React.useMemo(() => {
    if (!dbSettings || dbSettings.length === 0) {
      return defaultSettings;
    }

    const enabledApps = { ...defaultSettings.enabledApps };
    
    dbSettings.forEach((pref) => {
      const appName = pref.app_name as keyof typeof enabledApps;
      if (appName in enabledApps) {
        enabledApps[appName] = pref.enabled;
      }
    });

    return { enabledApps };
  }, [dbSettings]);

  // Mutation to update app preferences
  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ appName, enabled }: { appName: string; enabled: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating app preference:', { appName, enabled, userId: user.id });

      const { data, error } = await supabase
        .from('user_app_preferences')
        .upsert({
          user_id: user.id,
          app_name: appName,
          enabled: enabled,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,app_name'
        })
        .select();

      if (error) {
        console.error('Error updating app preference:', error);
        throw error;
      }

      console.log('App preference updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-app-preferences', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to update app preference:', error);
    },
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    if (!user) {
      console.warn('Cannot update settings: user not authenticated');
      return;
    }

    // Update each app preference individually
    if (newSettings.enabledApps) {
      Object.entries(newSettings.enabledApps).forEach(([appName, enabled]) => {
        updatePreferenceMutation.mutate({ appName, enabled });
      });
    }
  };

  const toggleApp = (app: 'public' | 'movies' | 'tvShows' | 'finance' | 'settlebill' | 'admin') => {
    if (!user) {
      console.warn('Cannot toggle app: user not authenticated');
      return;
    }

    const currentValue = settings.enabledApps[app];
    updatePreferenceMutation.mutate({ 
      appName: app, 
      enabled: !currentValue 
    });
    
    // Refresh the page to update navigation
    setTimeout(() => {
      window.location.reload();
    }, 500); // Small delay to allow database update
  };

  return {
    settings,
    updateSettings,
    toggleApp,
    isLoading,
  };
};
