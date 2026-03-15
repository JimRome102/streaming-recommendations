import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { preferencesApi, movieApi } from '../services/api';
import useUserStore from '../store/userStore';
import Loader from '../components/common/Loader';

const PreferencesPage = () => {
  const userId = useUserStore((state) => state.userId);
  const preferences = useUserStore((state) => state.preferences);
  const setPreferences = useUserStore((state) => state.setPreferences);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock']);
  const [minRating, setMinRating] = useState(6.0);

  // Fetch genres
  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await movieApi.getGenres('movie');
      return response.data;
    },
  });

  // Fetch user preferences
  const { isLoading: prefsLoading } = useQuery({
    queryKey: ['preferences', userId],
    queryFn: async () => {
      const response = await preferencesApi.get(userId);
      const prefs = response.data;
      setSelectedGenres(prefs.preferredGenres || []);
      setSelectedPlatforms(prefs.preferredPlatforms || ['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock']);
      setMinRating(prefs.minRating || 6.0);
      setPreferences(prefs);
      return prefs;
    },
  });

  // Save preferences mutation
  const savePrefsMutation = useMutation({
    mutationFn: (data) => preferencesApi.update(data),
    onSuccess: (response) => {
      setPreferences(response.data);
      alert('Preferences saved successfully!');
    },
  });

  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSave = () => {
    savePrefsMutation.mutate({
      userId,
      preferredGenres: selectedGenres,
      preferredPlatforms: selectedPlatforms,
      minRating,
      excludeGenres: [],
    });
  };

  if (genresLoading || prefsLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Preferences</h1>
      <p className="text-gray-400 mb-8">
        Customize your recommendations by selecting your favorite genres and streaming platforms
      </p>

      {/* Streaming Platforms */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Streaming Platforms</h2>
        <p className="text-gray-400 text-sm mb-4">
          Select which platforms you have access to
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock'].map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                selectedPlatforms.includes(platform)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {platform === 'hbo' ? 'Max' :
               platform === 'disney' ? 'Disney+' :
               platform === 'paramount' ? 'Paramount+' :
               platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Minimum Rating</h2>
        <p className="text-gray-400 text-sm mb-4">
          Only recommend content with at least this rating
        </p>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-2xl font-bold text-red-600 w-16">
            {minRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Genres */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Favorite Genres</h2>
        <p className="text-gray-400 text-sm mb-4">
          Select your preferred genres (optional - we'll learn from your ratings)
        </p>

        <div className="flex flex-wrap gap-2">
          {genres?.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGenres.includes(genre.id)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={savePrefsMutation.isPending}
          className="btn-primary px-8 py-3 text-lg"
        >
          {savePrefsMutation.isPending ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;
