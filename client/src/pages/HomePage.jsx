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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-snug tracking-tight">
            Find Something
            <span className="text-red-600"> Worth Watching</span>
          </h1>

          <p className="text-lg text-gray-400 mb-5 max-w-2xl mx-auto">
            Tired of scrolling for 20 minutes only to rewatch The Office again?
          </p>

          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Combines critic reviews, IMDb ratings, Reddit buzz, and your taste into one score
          </p>
        </div>

        {/* CTA Section */}
        <div className="mb-20 max-w-2xl mx-auto">
          {!hasEnoughRatings ? (
            <div className="text-center bg-gradient-to-br from-red-900/20 to-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-red-500/30">
              <div className="text-4xl font-bold text-red-500 mb-3 tracking-tight">
                {ratingsCount} / 5 ratings
              </div>
              <p className="text-gray-400 mb-8">
                Rate {5 - ratingsCount} more {5 - ratingsCount === 1 ? 'movie' : 'movies'} to unlock personalized recommendations
              </p>
              <Link to="/rate" className="btn-primary text-lg px-8 py-3">
                Start Rating
              </Link>
            </div>
          ) : (
            <div className="text-center bg-gradient-to-br from-green-900/20 to-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-green-500/30">
              <div className="text-3xl text-green-500 font-semibold mb-3">✓ You're All Set!</div>
              <p className="text-lg text-gray-300 mb-8">
                You've rated {ratingsCount} movies
              </p>
              <Link to="/recommendations" className="btn-primary text-lg px-8 py-3">
                Get Recommendations
              </Link>
            </div>
          )}
        </div>

        {/* Algorithm Breakdown */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-gray-900 rounded-xl border border-purple-500/30">
              <div className="text-4xl font-bold text-purple-400 mb-3 tracking-tight">25%</div>
              <div className="text-base font-semibold mb-2">Critics</div>
              <div className="text-sm text-gray-400">Rotten Tomatoes, Metacritic</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/20 to-gray-900 rounded-xl border border-blue-500/30">
              <div className="text-4xl font-bold text-blue-400 mb-3 tracking-tight">25%</div>
              <div className="text-base font-semibold mb-2">User Ratings</div>
              <div className="text-sm text-gray-400">IMDb, TMDb</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-3 tracking-tight">20%</div>
              <div className="text-base font-semibold mb-2">Social Trends</div>
              <div className="text-sm text-gray-400">Reddit discussions</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-900/20 to-gray-900 border border-red-500/30 rounded-xl">
              <div className="text-4xl font-bold text-red-400 mb-3 tracking-tight">30%</div>
              <div className="text-base font-semibold mb-2">Your Taste</div>
              <div className="text-sm text-gray-400">Based on your ratings</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto pt-12 border-t border-gray-800">
          <p className="mb-2">
            Learning project built with React, Node.js, PostgreSQL, and Redis
          </p>
          <p className="text-xs text-gray-600">
            Streaming data may be incomplete • The focus is on the algorithm, not production-ready streaming integrations
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
