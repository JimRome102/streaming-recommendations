import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore';

const HomePage = () => {
  const userId = useUserStore((state) => state.userId);
  const ratingsCount = useUserStore((state) => state.ratings.length);
  const hasEnoughRatings = ratingsCount >= 5;

  // Debug: Show userId in console
  console.log('Current userId:', userId);
  console.log('Ratings count:', ratingsCount);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Find Something
            <span className="text-red-600"> Worth Watching</span>
          </h1>

          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Combines critic reviews, IMDb ratings, Reddit buzz, and your personal taste into one score
          </p>
        </div>

        {/* CTA Section */}
        <div className="card mb-20 bg-gradient-to-br from-red-900/10 to-gray-900/50 border-red-500/20 max-w-2xl mx-auto">
          {!hasEnoughRatings ? (
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-3">
                {ratingsCount} / 5
              </div>
              <p className="text-xl text-gray-300 mb-8">
                Rate {5 - ratingsCount} more {5 - ratingsCount === 1 ? 'movie' : 'movies'} to get started
              </p>
              <Link to="/rate" className="btn-primary text-lg px-8 py-3">
                Start Rating
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <p className="text-2xl text-green-400 font-semibold mb-8">
                You've rated {ratingsCount} movies
              </p>
              <Link to="/recommendations" className="btn-primary text-lg px-8 py-3">
                See Your Recommendations
              </Link>
            </div>
          )}
        </div>

        {/* Algorithm Breakdown */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">The Algorithm</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card p-6 bg-gradient-to-br from-purple-900/20 to-gray-900 border-purple-500/30">
              <div className="text-4xl font-bold text-purple-400 mb-3">25%</div>
              <div className="text-lg font-semibold mb-2">Critics</div>
              <div className="text-sm text-gray-400">Rotten Tomatoes, Metacritic</div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-blue-900/20 to-gray-900 border-blue-500/30">
              <div className="text-4xl font-bold text-blue-400 mb-3">25%</div>
              <div className="text-lg font-semibold mb-2">User Ratings</div>
              <div className="text-sm text-gray-400">IMDb, TMDb</div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-green-900/20 to-gray-900 border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-3">20%</div>
              <div className="text-lg font-semibold mb-2">Social Buzz</div>
              <div className="text-sm text-gray-400">Reddit trends</div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-red-900/20 to-gray-900 border-red-500/30">
              <div className="text-4xl font-bold text-red-400 mb-3">30%</div>
              <div className="text-lg font-semibold mb-2">Your Taste</div>
              <div className="text-sm text-gray-400">Genre extraction</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p className="mb-2">
            Learning project built with React, Node.js, PostgreSQL, and Redis
          </p>
          <p>
            Streaming data may be incomplete • Focus is on the algorithm, not production accuracy
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
