import StreamingBadge from '../common/StreamingBadge';
import StarRating from '../common/StarRating';

const MovieCard = ({ movie, onRate, showRating = false, userRating = null }) => {
  const getPlatforms = () => {
    if (!movie.streamingPlatforms) return [];

    return Object.entries(movie.streamingPlatforms)
      .filter(([_, available]) => available)
      .map(([platform]) => platform);
  };

  const platforms = getPlatforms();

  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      {/* Poster */}
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-900">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}

        {/* Score Badge */}
        {movie.score && (
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-bold">
            {movie.score}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>

      {/* Ratings */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        {movie.tmdbRating && (
          <span>TMDb: {movie.tmdbRating.toFixed(1)}</span>
        )}
        {movie.imdbRating && (
          <span>IMDb: {movie.imdbRating.toFixed(1)}</span>
        )}
        {movie.rtScore && (
          <span>RT: {movie.rtScore}%</span>
        )}
      </div>

      {/* Streaming Platforms */}
      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {platforms.map((platform) => (
            <StreamingBadge key={platform} platform={platform} />
          ))}
        </div>
      )}

      {/* User Rating */}
      {showRating && onRate && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <StarRating
            rating={userRating || 0}
            onRate={(rating) => onRate(movie, rating)}
            interactive={true}
          />
        </div>
      )}

      {/* Overview */}
      {movie.overview && (
        <p className="text-sm text-gray-400 mt-3 line-clamp-3">
          {movie.overview}
        </p>
      )}
    </div>
  );
};

export default MovieCard;
