import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieApi, ratingApi } from '../services/api';
import useUserStore from '../store/userStore';
import Loader from '../components/common/Loader';
import MovieCard from '../components/movies/MovieCard';

const RatingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const userId = useUserStore((state) => state.userId);
  const ratings = useUserStore((state) => state.ratings);
  const addRating = useUserStore((state) => state.addRating);

  const queryClient = useQueryClient();

  // Fetch user ratings
  const { isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings', userId],
    queryFn: async () => {
      const response = await ratingApi.getUserRatings(userId);
      useUserStore.setState({ ratings: response.data });
      return response.data;
    },
  });

  // Create rating mutation
  const createRatingMutation = useMutation({
    mutationFn: (ratingData) => ratingApi.create(ratingData),
    onSuccess: (response) => {
      addRating(response.data);
      queryClient.invalidateQueries(['ratings', userId]);
    },
  });

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await movieApi.search(searchQuery);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Rate handler
  const handleRate = (movie, rating) => {
    createRatingMutation.mutate({
      userId,
      tmdbId: movie.tmdbId,
      mediaType: movie.mediaType,
      rating,
      title: movie.title,
    });

    // Update search results to show new rating
    setSearchResults((prev) =>
      prev.map((m) => (m.tmdbId === movie.tmdbId ? { ...m, userRating: rating } : m))
    );
  };

  // Create ratings map for quick lookup
  const ratingsMap = ratings.reduce((acc, rating) => {
    acc[rating.tmdbId] = rating.rating;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Rate Movies & Shows</h1>
      <p className="text-gray-400 mb-8">
        Rate at least 5 items to unlock personalized recommendations ({ratings.length} rated so far)
      </p>

      {/* Search Bar */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies or TV shows..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {isSearching && <Loader />}

      {searchResults.length > 0 && !isSearching && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                movie={movie}
                onRate={handleRate}
                showRating={true}
                userRating={ratingsMap[movie.tmdbId]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Your Ratings */}
      {ratings.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Ratings ({ratings.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="card">
                <h3 className="font-semibold mb-2 line-clamp-2">{rating.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">
                    {'★'.repeat(Math.round(rating.rating))}
                  </span>
                  <span className="text-gray-400">{rating.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching && searchResults.length === 0 && ratings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">Search for movies or shows to start rating</p>
          <p className="text-sm">Try searching for "Inception", "Breaking Bad", or your favorites</p>
        </div>
      )}
    </div>
  );
};

export default RatingsPage;
