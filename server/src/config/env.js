require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  apis: {
    tmdb: {
      key: process.env.TMDB_API_KEY,
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
      rateLimit: 40, // requests per 10 seconds
    },
    watchmode: {
      key: process.env.WATCHMODE_API_KEY,
      baseUrl: 'https://api.watchmode.com/v1',
    },
    omdb: {
      key: process.env.OMDB_API_KEY,
      baseUrl: 'http://www.omdbapi.com',
    },
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      userAgent: process.env.REDDIT_USER_AGENT || 'streaming-rec-bot/1.0',
    },
  },

  cache: {
    ttl: {
      movieMetadata: 7 * 24 * 60 * 60, // 7 days
      streamingAvailability: 24 * 60 * 60, // 24 hours
      socialTrends: 12 * 60 * 60, // 12 hours
      searchResults: 60 * 60, // 1 hour
    },
  },
};

module.exports = config;
