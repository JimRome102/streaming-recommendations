import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-red-600">StreamPick</div>
            <div className="text-xs text-gray-400 hidden md:block">
              Smart Recommendations
            </div>
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/rate"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Rate Movies
            </Link>
            <Link
              to="/preferences"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Preferences
            </Link>
            <Link
              to="/recommendations"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Recommendations
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
