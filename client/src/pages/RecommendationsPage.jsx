import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '../services/api';
import useUserStore from '../store/userStore';
import Loader from '../components/common/Loader';
import MovieGrid from '../components/movies/MovieGrid';
import FilterPanel from '../components/recommendations/FilterPanel';

const RecommendationsPage = () => {
  const userId = useUserStore((state) => state.userId);
  const ratingsCount = useUserStore((state) => state.ratings.length);

  const [selectedPlatforms, setSelectedPlatforms] = useState(['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock']);

  // Fetch recommendations
  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recommendations', userId, selectedPlatforms.join(',')],
    queryFn: async () => {
      // Don't send empty platform list
      const platformParam = selectedPlatforms.length > 0
        ? selectedPlatforms.join(',')
        : 'netflix,hulu,prime,hbo,disney,paramount,showtime,peacock';

      const response = await recommendationsApi.get(userId, {
        count: 20,
        platform: platformParam,
      });
      return response.data.recommendations;
    },
    enabled: ratingsCount >= 5,
    keepPreviousData: true, // Keep showing old data while fetching new data
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  // Not enough ratings
  if (ratingsCount < 5) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Not Enough Ratings</h1>
          <p className="text-gray-400 mb-6">
            You need to rate at least 5 movies or shows before we can generate personalized recommendations.
          </p>
          <p className="text-2xl font-bold text-red-600 mb-6">
            {ratingsCount} / 5 ratings
          </p>
          <a href="/rate" className="btn-primary inline-block">
            Rate More Content
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Recommendations</h1>
          <p className="text-gray-400">
            Personalized picks based on your ratings and preferences
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-secondary">
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterPanel
          platforms={selectedPlatforms}
          onPlatformChange={handlePlatformToggle}
        />
      </div>

      {/* Loading State */}
      {isLoading && <Loader />}

      {/* Error State */}
      {error && (
        <div className="card bg-red-900/20 border border-red-600 text-center">
          <p className="text-red-500">
            {error.response?.data?.error || 'Failed to load recommendations'}
          </p>
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && !error && recommendations && (
        <div>
          <div className="mb-4 text-gray-400">
            Showing {recommendations.length} recommendations
          </div>
          <MovieGrid movies={recommendations} showRating={false} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!recommendations || recommendations.length === 0) && (
        <div className="card text-center">
          <p className="text-gray-400 mb-4">
            No recommendations found for the selected platforms
          </p>
          <p className="text-sm text-gray-500">
            Try selecting different platforms or rate more content
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
