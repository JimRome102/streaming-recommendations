const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { scheduleTrendsUpdate } = require('./jobs/updateTrends');

// Import routes
const moviesRouter = require('./routes/movies');
const ratingsRouter = require('./routes/ratings');
const preferencesRouter = require('./routes/preferences');
const recommendationsRouter = require('./routes/recommendations');
const debugRouter = require('./routes/debug');

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/movies', moviesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/debug', debugRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  Streaming Recommendations API                        ║
║  Environment: ${config.nodeEnv.padEnd(39)} ║
║  Port: ${PORT.toString().padEnd(44)} ║
║  Frontend: ${config.frontendUrl.padEnd(40)} ║
╚═══════════════════════════════════════════════════════╝
  `);

  // Schedule background jobs
  scheduleTrendsUpdate();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
