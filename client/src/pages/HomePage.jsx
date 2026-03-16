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
          Smarter Streaming Recommendations
          <span className="text-red-600"> Across Every Platform</span>
        </h1>

        <p className="text-xl text-gray-300 mb-3 leading-relaxed">
          Personalized movie and TV recommendations across your streaming services.
        </p>
        <p className="text-lg text-gray-400 mb-12">
          Powered by critic reviews, user ratings, and social trends.
        </p>

        {/* CTA Section */}
        <div className="card mb-12">
          {!hasEnoughRatings ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-400 mb-4">
                Rate at least 5 movies or shows to unlock personalized recommendations
              </p>
              <div className="text-3xl font-bold text-red-600 mb-6">
                {ratingsCount} / 5 ratings
              </div>
              <div className="flex justify-center gap-4">
                <Link to="/rate" className="btn-primary">
                  Rate Movies
                </Link>
                <Link to="/preferences" className="btn-secondary">
                  Set Preferences
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">You're All Set!</h2>
              <p className="text-green-500 mb-6 text-lg">
                You've rated {ratingsCount} items
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/recommendations" className="btn-primary inline-block">
                  Get Recommendations
                </Link>
                <Link to="/rate" className="btn-secondary inline-block">
                  Rate More Movies
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How Our Recommendations Work</h2>
          <p className="text-gray-400 mb-8">
            We combine multiple signals to find content you'll love
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="card p-4">
              <div className="text-2xl font-bold text-purple-400 mb-2">25%</div>
              <div className="font-semibold mb-1">Critics</div>
              <div className="text-gray-400">Rotten Tomatoes, Metacritic</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-bold text-blue-400 mb-2">25%</div>
              <div className="font-semibold mb-1">User Ratings</div>
              <div className="text-gray-400">IMDb, TMDb community</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-bold text-green-400 mb-2">20%</div>
              <div className="font-semibold mb-1">Social Trends</div>
              <div className="text-gray-400">Reddit discussions</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-bold text-red-400 mb-2">30%</div>
              <div className="font-semibold mb-1">Your Taste</div>
              <div className="text-gray-400">Based on your ratings</div>
            </div>
          </div>
        </div>

        {/* Features - User Outcomes */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-900 p-8 border border-purple-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-3 text-white">Smarter Recommendations</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our algorithm combines critic reviews, audience ratings, and social trends to surface quality content.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 via-gray-900 to-gray-900 p-8 border border-blue-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-3 text-white">All Your Streaming Services</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Find recommendations across Netflix, Hulu, Prime Video, Max, Disney+, Paramount+, Showtime, and Peacock.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/20 via-gray-900 to-gray-900 p-8 border border-green-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-white">No More Endless Scrolling</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Balanced recommendations across genres and platforms. Discover hidden gems without decision fatigue.
              </p>
            </div>
          </div>
        </div>

        {/* Why I Built This */}
        <div className="card bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Why I Built This</h2>
          <p className="text-gray-300 leading-relaxed">
            I built StreamPick to explore how recommendation systems can combine critic signals, audience behavior, and personal taste to help people find better content faster. This project demonstrates full-stack development with external API integration, composite scoring algorithms, and real-world caching strategies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
