import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onRate, showRating = false, userRatingsMap = {} }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No movies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.tmdbId}
          movie={movie}
          onRate={onRate}
          showRating={showRating}
          userRating={userRatingsMap[movie.tmdbId]}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
