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
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-snug tracking-tight">
            Find Something
            <span className="text-red-600"> Worth Watching</span>
          </h1>

          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Tired of scrolling for 20 minutes only to rewatch The Office again? This combines critic reviews, IMDb ratings, Reddit buzz, and your personal taste into one score.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mb-14 max-w-2xl mx-auto">
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
            <div className="text-center bg-gradient-to-br from-cyan-900/20 to-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-cyan-500/30">
              <div className="text-3xl text-cyan-400 font-semibold mb-3">✓ You're All Set!</div>
              <p className="text-lg text-gray-300 mb-8">
                You've rated {ratingsCount} movies
              </p>
              <Link to="/recommendations" className="btn-primary text-lg px-8 py-3">
                Get Recommendations
              </Link>
            </div>
          )}
        </div>

        {/* Visual Example */}
        <div className="mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">See It In Action</h2>
          <div className="bg-gray-900/40 rounded-2xl p-8 border border-gray-700/30">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Sample Movie Card */}
              <div className="flex-shrink-0">
                <div className="w-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="aspect-[2/3] bg-gradient-to-br from-blue-900/30 via-gray-800 to-purple-900/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-lg font-bold text-gray-300 tracking-widest">INCEPTION</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold mb-1">Inception</div>
                    <div className="text-xs text-gray-400">Action, Sci-Fi, Thriller</div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🍅</span>
                      <span className="text-sm font-medium">Critics</span>
                    </div>
                    <div className="text-purple-400 font-bold">87/100</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⭐</span>
                      <span className="text-sm font-medium">Users</span>
                    </div>
                    <div className="text-blue-400 font-bold">83/100</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💬</span>
                      <span className="text-sm font-medium">Social</span>
                    </div>
                    <div className="text-green-400 font-bold">94/100</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <span className="text-sm font-medium">Your Match</span>
                    </div>
                    <div className="text-red-400 font-bold">96/100</div>
                  </div>

                  {/* Final Score */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 mt-4">
                    <span className="font-semibold">Final Score</span>
                    <div className="text-2xl font-bold text-white">89/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Breakdown */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">The Algorithm</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-gray-900 rounded-xl border border-purple-500/30">
              <div className="text-3xl mb-3">🍅</div>
              <div className="text-4xl font-bold text-purple-400 mb-3 tracking-tight">25%</div>
              <div className="text-base font-semibold mb-2">Critics</div>
              <div className="text-sm text-gray-400">Rotten Tomatoes, Metacritic</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/20 to-gray-900 rounded-xl border border-blue-500/30">
              <div className="text-3xl mb-3">⭐</div>
              <div className="text-4xl font-bold text-blue-400 mb-3 tracking-tight">25%</div>
              <div className="text-base font-semibold mb-2">User Ratings</div>
              <div className="text-sm text-gray-400">IMDb, TMDb</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl border border-green-500/30">
              <div className="text-3xl mb-3">💬</div>
              <div className="text-4xl font-bold text-green-400 mb-3 tracking-tight">20%</div>
              <div className="text-base font-semibold mb-2">Social Trends</div>
              <div className="text-sm text-gray-400">Reddit discussions</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-900/20 to-gray-900 border border-red-500/30 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <div className="text-4xl font-bold text-red-400 mb-3 tracking-tight">30%</div>
              <div className="text-base font-semibold mb-2">Your Taste</div>
              <div className="text-sm text-gray-400">Based on your ratings</div>
            </div>
          </div>

          {/* Insight Callout */}
          <div className="max-w-3xl mx-auto mt-8 p-6 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-xl border border-blue-500/20">
            <div className="flex gap-3">
              <div className="text-2xl flex-shrink-0">💡</div>
              <div>
                <div className="font-semibold text-blue-400 mb-2">Why 30% personal taste?</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  After testing different weight combinations, 30% personal match balanced personalization with discovery. Lower weights led to generic recommendations everyone sees. Higher weights created filter bubbles where you only get more of what you've already watched. This ratio surfaces content aligned with your taste while maintaining diversity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center max-w-2xl mx-auto pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-2">
            Side project exploring recommendation algorithms • Built with React, Node.js, PostgreSQL, and Redis
          </p>
          <p className="text-sm text-gray-500">
            Streaming data may be incomplete • Focus is on the algorithm and personalization engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
