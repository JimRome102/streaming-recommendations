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
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover Your Next
          <span className="text-red-600"> Favorite Show</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12">
          Get personalized movie and TV recommendations across Netflix, Hulu, and Prime Video
          using advanced scoring that combines critic reviews, user ratings, and social trends.
        </p>

        {/* Status Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>

          {!hasEnoughRatings ? (
            <div>
              <p className="text-gray-400 mb-4">
                Rate at least 5 movies or shows to unlock personalized recommendations
              </p>
              <div className="text-3xl font-bold text-red-600 mb-6">
                {ratingsCount} / 5 ratings
              </div>
              <Link to="/rate" className="btn-primary inline-block">
                Start Rating Movies
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-green-500 mb-4 text-lg">
                You've rated {ratingsCount} items - ready for recommendations!
              </p>
              <Link to="/recommendations" className="btn-primary inline-block">
                View Recommendations
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Link to="/rate" className="btn-primary">
            Rate Movies
          </Link>
          <Link to="/preferences" className="btn-secondary">
            Set Preferences
          </Link>
        </div>

        {/* Features - Static Info Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-gray-900 to-gray-900 p-8 border-2 border-purple-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-6xl mb-6">🎬</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Algorithm</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span>25% Critics (RT, Metacritic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span>25% User Ratings (IMDb, TMDb)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span>20% Social Trends (Reddit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span>30% Your Personal Taste</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 via-gray-900 to-gray-900 p-8 border-2 border-blue-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-6xl mb-6">📺</div>
              <h3 className="text-2xl font-bold mb-4 text-white">8 Streaming Platforms</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-red-600/80 rounded-full">Netflix</span>
                <span className="px-3 py-1 bg-green-600/80 rounded-full">Hulu</span>
                <span className="px-3 py-1 bg-blue-600/80 rounded-full">Prime</span>
                <span className="px-3 py-1 bg-purple-600/80 rounded-full">Max</span>
                <span className="px-3 py-1 bg-blue-500/80 rounded-full">Disney+</span>
                <span className="px-3 py-1 bg-blue-700/80 rounded-full">Paramount+</span>
                <span className="px-3 py-1 bg-red-700/80 rounded-full">Showtime</span>
                <span className="px-3 py-1 bg-gray-700/80 rounded-full">Peacock</span>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                All your streaming services in one place
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/30 via-gray-900 to-gray-900 p-8 border-2 border-green-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Diverse Selection</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Our algorithm ensures variety in every recommendation set:
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Max 3 items per genre</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Balanced across platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>No duplicates for 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
