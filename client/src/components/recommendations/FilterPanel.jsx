const FilterPanel = ({ platforms, onPlatformChange, genres, onGenreChange }) => {
  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Platform Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Streaming Platforms</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock'].map((platform) => (
            <button
              key={platform}
              onClick={() => onPlatformChange(platform)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                platforms.includes(platform)
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

      {/* Genre Filters */}
      {genres && genres.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onGenreChange(genre.id)}
                className="px-3 py-1 rounded-lg text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
