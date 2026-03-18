import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl font-bold text-red-600 group-hover:text-red-500 transition-colors">
              StreamPick
            </div>
          </Link>

          <nav className="flex gap-8">
            <Link
              to="/rate"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Rate
            </Link>
            <Link
              to="/recommendations"
              className="text-gray-300 hover:text-white transition-colors font-medium"
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
