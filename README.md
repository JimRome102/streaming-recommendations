# StreamPick - Streaming Recommendations App

A full-stack web application that provides personalized movie and TV show recommendations across 8 major streaming platforms (Netflix, Hulu, Prime Video, Max, Disney+, Paramount+, Showtime, and Peacock) using a weighted scoring algorithm that combines critic reviews, user ratings, social trends, and personal preferences.

## Features

- **Smart Recommendations**: Composite scoring algorithm combining multiple data signals
  - Critics Score (25%): Rotten Tomatoes/Metacritic
  - User Ratings (25%): IMDb/TMDb community ratings
  - Social Trends (20%): Reddit mentions and engagement
  - Personal Match (30%): Genre preferences and viewing history

- **Multi-Platform Support**: Discover content across 8 streaming platforms (Netflix, Hulu, Prime Video, Max, Disney+, Paramount+, Showtime, Peacock)
- **Diversity Filtering**: Ensures variety across genres and platforms
- **User Ratings**: Rate movies/shows to build your taste profile
- **Custom Preferences**: Set genre and platform preferences
- **No Duplicates**: Tracks recommendation history to avoid repetition

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Tailwind CSS
- React Query (TanStack Query)
- Zustand (state management)
- Axios

### Backend
- Node.js 18+ with Express
- PostgreSQL with Prisma ORM
- Redis for caching
- node-cron for scheduled tasks

### External APIs
- TMDb API - Movie/TV metadata
- Watchmode API - Streaming availability
- Reddit API - Social trends
- OMDb API - IMDb/Rotten Tomatoes ratings

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- API Keys (see Setup section)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Set Up Databases

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis
docker compose up -d
```

#### Option B: Manual Installation
Install PostgreSQL and Redis manually and ensure they're running on default ports.

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your API keys:

```env
# Database
DATABASE_URL=postgresql://streamuser:streampass@localhost:5432/streaming_rec

# Redis
REDIS_URL=redis://localhost:6379

# External APIs
TMDB_API_KEY=your_tmdb_key_here          # Get from https://www.themoviedb.org/settings/api
WATCHMODE_API_KEY=your_watchmode_key_here # Get from https://api.watchmode.com
OMDB_API_KEY=your_omdb_key_here          # Get from http://www.omdbapi.com/apikey.aspx
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_secret
REDDIT_USER_AGENT=streaming-rec-bot/1.0

# Server Config
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

#### Getting API Keys

1. **TMDb API** (Free)
   - Sign up at https://www.themoviedb.org
   - Go to Settings → API
   - Request an API key
   - Use the "API Key (v3 auth)"

2. **Watchmode API** (Free tier: 1000 requests/month)
   - Sign up at https://api.watchmode.com
   - Get your API key from the dashboard

3. **OMDb API** (Paid: $1/month for 1000 requests/day)
   - Sign up at http://www.omdbapi.com/apikey.aspx
   - Choose the $1/month tier

4. **Reddit API** (Optional - Free)
   - Create an app at https://www.reddit.com/prefs/apps
   - Select "script" type
   - Copy client ID and secret

#### Frontend (.env)
```bash
cd client
cp .env.example .env
```

The default values should work for local development.

### 4. Initialize Database

```bash
cd server

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Or push schema (faster for development)
npm run db:push
```

### 5. Start the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

The server will start at http://localhost:3001

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

The frontend will start at http://localhost:5173

## Usage Guide

### 1. Rate Content
- Navigate to "Rate Movies"
- Search for movies or TV shows
- Rate at least 5 items (required for recommendations)

### 2. Set Preferences (Optional)
- Go to "Preferences"
- Select streaming platforms you have access to
- Choose favorite genres
- Set minimum rating threshold

### 3. Get Recommendations
- Navigate to "Recommendations"
- View 20 personalized recommendations
- Filter by platform
- Click "Refresh" for new recommendations

## Project Structure

```
streaming-recommendations/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable components
│   │   │   ├── layout/        # Header, navigation
│   │   │   ├── movies/        # Movie cards and grids
│   │   │   └── recommendations/
│   │   ├── pages/             # Main pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API clients
│   │   ├── store/             # Zustand state
│   │   └── utils/             # Utilities
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── config/            # Database, Redis, env config
│   │   ├── controllers/       # Request handlers
│   │   ├── services/
│   │   │   ├── external/      # External API services
│   │   │   └── recommendationEngine.js
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Error handling
│   │   └── jobs/              # Cron jobs
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
└── docker-compose.yml         # PostgreSQL + Redis
```

## API Endpoints

### Movies
```
GET  /api/movies/search?q=inception
GET  /api/movies/:tmdbId
GET  /api/movies/popular
GET  /api/movies/trending
GET  /api/movies/genres
```

### Ratings
```
POST   /api/ratings
GET    /api/ratings?userId=xxx
PUT    /api/ratings/:id
DELETE /api/ratings/:id
```

### Preferences
```
GET  /api/preferences?userId=xxx
POST /api/preferences
```

### Recommendations
```
GET  /api/recommendations?userId=xxx&count=20&platform=netflix,hulu
POST /api/recommendations/hide/:tmdbId
```

## Recommendation Algorithm

The recommendation engine uses a weighted composite score:

```
Final Score = (Critics × 0.25) + (User Ratings × 0.25) +
              (Social Trends × 0.20) + (Personal Match × 0.30)
```

### Diversity Filtering
- Maximum 5 items per genre
- Balanced across all platforms
- Excludes content recommended in last 30 days
- Excludes already-rated content

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps  # or: pg_isadmin

# Reset database
cd server
npx prisma migrate reset
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG
```

### API Rate Limits
- TMDb: 40 requests per 10 seconds (handled by caching)
- Watchmode: 1000 requests per month
- OMDb: 1000 requests per day ($1 plan)

### Port Already in Use
```bash
# Change ports in .env files if needed
# Backend: PORT=3001
# Frontend: VITE_PORT=5173 (in vite.config.js)
```

## Development Commands

### Backend
```bash
npm run dev         # Start with nodemon
npm start          # Start production server
npm run db:migrate # Run database migrations
npm run db:studio  # Open Prisma Studio
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Future Enhancements

- User authentication (Clerk/Auth0)
- Viewing history import
- Advanced ML-based recommendations
- Mobile app (React Native)
- Friend recommendations
- Content availability alerts
- Watchlist management

## License

MIT

## Credits

- TMDb API for movie/TV metadata
- Watchmode API for streaming availability
- OMDb API for IMDb/RT ratings
- Reddit API for social trends
