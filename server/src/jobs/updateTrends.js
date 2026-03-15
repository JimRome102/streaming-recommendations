const cron = require('node-cron');
const socialTrendsService = require('../services/socialTrendsService');

// Run daily at 2 AM
const scheduleTrendsUpdate = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('Running scheduled social trends update...');
    try {
      await socialTrendsService.updateTrends();
      await socialTrendsService.cleanOldTrends(30);
    } catch (error) {
      console.error('Scheduled trends update failed:', error);
    }
  });

  console.log('✓ Social trends update scheduled (daily at 2 AM)');
};

module.exports = { scheduleTrendsUpdate };
