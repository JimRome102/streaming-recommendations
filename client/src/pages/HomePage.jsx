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
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Find Something
            <span className="text-red-600"> Worth Watching</span>
          </h1>

          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            Tired of scrolling for 20 minutes only to rewatch The Office again?
          </p>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Combines critic reviews, IMDb ratings, Reddit buzz, and your taste into one score
          </p>
        </div>

        {/* CTA Section */}
        <div className="mb-24 max-w-xl mx-auto">
          {!hasEnoughRatings ? (
            <div className="text-center bg-gray-900/40 backdrop-blur-sm rounded-2xl p-10 border border-gray-700/30">
              <div className="text-6xl font-bold text-red-500 mb-4">
                {ratingsCount} / 5
              </div>
              <p className="text-lg text-gray-400 mb-8">
                Rate {5 - ratingsCount} more to get started
              </p>
              <Link to="/rate" className="btn-primary">
                Start Rating
              </Link>
            </div>
          ) : (
            <div className="text-center bg-gray-900/40 backdrop-blur-sm rounded-2xl p-10 border border-gray-700/30">
              <div className="text-6xl mb-4">✓</div>
              <p className="text-xl text-green-400 mb-8">
                You've rated {ratingsCount} movies
              </p>
              <Link to="/recommendations" className="btn-primary">
                See Your Recommendations
              </Link>
            </div>
          )}
        </div>

        {/* Algorithm Breakdown */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-300">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-purple-400 mb-2">25%</div>
              <div className="text-sm font-semibold mb-1">Critics</div>
              <div className="text-xs text-gray-500">RT, Metacritic</div>
            </div>
            <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
              <div className="text-sm font-semibold mb-1">Users</div>
              <div className="text-xs text-gray-500">IMDb, TMDb</div>
            </div>
            <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-green-400 mb-2">20%</div>
              <div className="text-sm font-semibold mb-1">Social</div>
              <div className="text-xs text-gray-500">Reddit</div>
            </div>
            <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-red-400 mb-2">30%</div>
              <div className="text-sm font-semibold mb-1">Your Taste</div>
              <div className="text-xs text-gray-500">Your ratings</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 max-w-xl mx-auto pt-8 border-t border-gray-800">
          <p>
            Learning project • React + Node.js + PostgreSQL + Redis
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
