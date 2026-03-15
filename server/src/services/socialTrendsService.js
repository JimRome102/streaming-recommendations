const prisma = require('../config/database');
const redditService = require('./external/redditService');

class SocialTrendsService {
  // Update trending data from Reddit
  async updateTrends() {
    try {
      console.log('Fetching trending posts from Reddit...');
      const posts = await redditService.getAllTrendingPosts('day', 25);

      // Extract titles from posts
      const titles = redditService.extractTitles(posts);

      // Save top trends to database
      const topTrends = titles.slice(0, 50);
      for (const trend of topTrends) {
        await prisma.socialTrend.create({
          data: {
            title: trend.title,
            source: trend.topPost.subreddit,
            mentions: trend.mentions,
            postUrl: trend.topPost.url,
            upvotes: trend.topPost.upvotes,
            trendingDate: new Date(),
          },
        });
      }

      console.log(`✓ Updated ${topTrends.length} social trends`);
      return topTrends.length;
    } catch (error) {
      console.error('Error updating social trends:', error.message);
      throw error;
    }
  }

  // Get recent trending titles
  async getRecentTrends(days = 7, limit = 50) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await prisma.socialTrend.findMany({
      where: {
        trendingDate: { gte: cutoffDate },
      },
      orderBy: [
        { mentions: 'desc' },
        { upvotes: 'desc' },
      ],
      take: limit,
    });
  }

  // Clean old trends
  async cleanOldTrends(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.socialTrend.deleteMany({
      where: {
        trendingDate: { lt: cutoffDate },
      },
    });

    console.log(`Cleaned ${result.count} old social trends`);
    return result.count;
  }
}

module.exports = new SocialTrendsService();
