
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tv, Calendar } from 'lucide-react';
import { useShowUniverseData } from '@/hooks/useShowUniverseData';

export const PublicUniverseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useShowUniverseData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  // Find the universe by slug
  const universeData = data.find(item => 
    item.universe_name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === slug
  );

  if (!universeData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Universe Not Found</h1>
          <Link to="/public/universes" className="text-blue-600 hover:underline">
            Back to Universes
          </Link>
        </div>
      </div>
    );
  }

  // Get all episodes in this universe
  const universeEpisodes = data.filter(item => item.universe_id === universeData.universe_id);
  
  // Get unique shows in this universe
  const uniqueShows = [...new Set(universeEpisodes.map(item => item.show_id))].map(showId => {
    const showItem = universeEpisodes.find(item => item.show_id === showId);
    const showEpisodes = universeEpisodes.filter(item => item.show_id === showId);
    const seasons = [...new Set(showEpisodes.map(item => item.season_number))];
    
    return {
      ...showItem,
      episodeCount: showEpisodes.length,
      seasonCount: seasons.length
    };
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/public/universes" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Universes
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{universeData.universe_name}</h1>
        {universeData.universe_description && (
          <p className="text-muted-foreground">{universeData.universe_description}</p>
        )}
        <div className="mt-4">
          <Badge variant="outline" className="text-sm">
            {uniqueShows.length} shows • {universeEpisodes.length} episodes
          </Badge>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Shows in this Universe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueShows.map((show) => (
            <Card key={show?.show_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  <Link 
                    to={`/public/show/${show?.slug || show?.show_title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
                    className="text-blue-600 hover:underline"
                  >
                    {show?.show_title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {show?.show_description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {show.show_description}
                  </p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{show?.seasonCount} seasons</span>
                  <span>{show?.episodeCount} episodes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicUniverseDetail;
