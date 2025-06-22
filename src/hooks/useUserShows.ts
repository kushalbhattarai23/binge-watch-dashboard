
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserShow {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  totalEpisodes: number;
  watchedEpisodes: number;
  status: 'watching' | 'completed' | 'not_started';
}

export const useUserShows = () => {
  const { user } = useAuth();

  const { data: userShows = [], isLoading } = useQuery({
    queryKey: ['user-shows', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('useUserShows: No user authenticated');
        return [];
      }
      
      try {
        console.log('useUserShows: Fetching shows for user:', user.id);
        
        // First, update all episode counts for this user's tracked shows
        const { data: trackedShows } = await supabase
          .from('user_show_tracking')
          .select('show_id')
          .eq('user_id', user.id);

        if (trackedShows && trackedShows.length > 0) {
          console.log('useUserShows: Updating episode counts for tracked shows');
          // Update episode counts for each tracked show
          for (const track of trackedShows) {
            await supabase.rpc('update_user_show_episode_counts', {
              p_user_id: user.id,
              p_show_id: track.show_id
            });
          }
        }
        
        // Now get user's tracked shows with updated counts
        const { data: userTrackedShows, error: trackingError } = await supabase
          .from('user_show_tracking')
          .select(`
            show_id,
            total_episodes,
            watched_episodes,
            shows (
              id,
              title,
              description,
              poster_url,
              slug
            )
          `)
          .eq('user_id', user.id);
          
        if (trackingError) {
          console.error('useUserShows: Error fetching tracked shows:', trackingError);
          throw trackingError;
        }
        
        console.log('useUserShows: Raw tracked shows data:', userTrackedShows);
        
        if (!userTrackedShows || userTrackedShows.length === 0) {
          console.log('useUserShows: No tracked shows found');
          return [];
        }

        // Transform the data and add fallback calculation if needed
        const showsWithProgress = await Promise.all(
          userTrackedShows.map(async (item) => {
            const show = item.shows;
            if (!show) {
              console.warn('useUserShows: Missing show data for item:', item);
              return null;
            }

            let totalEpisodes = item.total_episodes || 0;
            let watchedEpisodes = item.watched_episodes || 0;

            // Fallback: If counts are 0, calculate them directly
            if (totalEpisodes === 0) {
              console.log('useUserShows: Calculating total episodes for show:', show.title);
              const { count: episodeCount } = await supabase
                .from('episodes')
                .select('*', { count: 'exact', head: true })
                .eq('show_id', show.id);
              
              totalEpisodes = episodeCount || 0;
            }

            if (watchedEpisodes === 0 && totalEpisodes > 0) {
              console.log('useUserShows: Calculating watched episodes for show:', show.title);
              const { count: watchedCount } = await supabase
                .from('user_episode_status')
                .select('*, episodes!inner(*)', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('episodes.show_id', show.id)
                .eq('status', 'watched');
              
              watchedEpisodes = watchedCount || 0;
            }

            console.log(`useUserShows: Show "${show.title}" - Total: ${totalEpisodes}, Watched: ${watchedEpisodes}`);

            // Determine status based on progress
            let status: 'watching' | 'completed' | 'not_started' = 'not_started';
            if (totalEpisodes > 0 && watchedEpisodes === totalEpisodes) {
              status = 'completed';
            } else if (watchedEpisodes > 0) {
              status = 'watching';
            }

            return {
              id: show.id,
              title: show.title,
              description: show.description,
              poster_url: show.poster_url,
              totalEpisodes,
              watchedEpisodes,
              status
            } as UserShow;
          })
        );

        const validShows = showsWithProgress.filter(Boolean) as UserShow[];
        console.log('useUserShows: Final shows with progress:', validShows);
        return validShows;
        
      } catch (error) {
        console.error('useUserShows: Error fetching user shows:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  console.log('useUserShows: Returning data:', { userShowsCount: userShows.length, isLoading });

  return {
    userShows,
    isLoading
  };
};
