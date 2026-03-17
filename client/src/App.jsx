import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import RatingsPage from './pages/RatingsPage';
import PreferencesPage from './pages/PreferencesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import RatingsFetcher from './components/common/RatingsFetcher';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <RatingsFetcher />
        <div className="min-h-screen bg-gray-950">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rate" element={<RatingsPage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
