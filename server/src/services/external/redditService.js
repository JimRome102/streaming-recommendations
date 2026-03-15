const snoowrap = require('snoowrap');
const config = require('../../config/env');
const redis = require('../../config/redis');

const TARGET_SUBREDDITS = ['movies', 'television', 'NetflixBestOf', 'Hulu', 'PrimeVideo'];

class RedditService {
  constructor() {
    this.client = null;
    this.enabled = false;

    // Reddit integration is optional - skip if not configured
    if (!config.apis.reddit.clientId || !config.apis.reddit.clientSecret ||
        config.apis.reddit.clientId === 'your_reddit_client_id_here') {
      console.log('ℹ Reddit API not configured - social trends features disabled');
      return;
    }

    // Note: snoowrap requires username/password for full API access
    // For MVP, we'll disable Reddit until proper credentials are provided
    console.log('ℹ Reddit integration available but requires full credentials');
  }

  // Get trending posts from movie/TV subreddits
  async getTrendingPosts(subreddit, timeFilter = 'day', limit = 25) {
    if (!this.client) {
      console.warn('Reddit client not initialized');
      return [];
    }

    const cacheKey = `reddit:trending:${subreddit}:${timeFilter}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const posts = await this.client
        .getSubreddit(subreddit)
        .getHot({ time: timeFilter, limit });

      const formattedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        text: post.selftext,
        upvotes: post.ups,
        upvoteRatio: post.upvote_ratio,
        numComments: post.num_comments,
        url: `https://reddit.com${post.permalink}`,
        created: new Date(post.created_utc * 1000),
        subreddit: post.subreddit.display_name,
      }));

      await redis.setex(cacheKey, config.cache.ttl.socialTrends, JSON.stringify(formattedPosts));
      return formattedPosts;
    } catch (error) {
      console.error(`Reddit trending posts error (${subreddit}):`, error.message);
      return [];
    }
  }

  // Get trending posts from all target subreddits
  async getAllTrendingPosts(timeFilter = 'day', limit = 25) {
    if (!this.client) {
      return [];
    }

    try {
      const allPosts = await Promise.all(
        TARGET_SUBREDDITS.map(sub => this.getTrendingPosts(sub, timeFilter, limit))
      );

      return allPosts.flat();
    } catch (error) {
      console.error('Reddit all trending posts error:', error.message);
      return [];
    }
  }

  // Extract movie/show titles from posts using simple pattern matching
  extractTitles(posts) {
    const titlePattern = /["']([^"']+)["']/g; // Titles in quotes
    const mentionedTitles = new Map();

    posts.forEach(post => {
      const text = `${post.title} ${post.text}`.toLowerCase();

      // Extract quoted titles
      let match;
      while ((match = titlePattern.exec(text)) !== null) {
        const title = match[1];
        if (title.length > 3) { // Filter out short strings
          const current = mentionedTitles.get(title) || { count: 0, posts: [] };
          current.count++;
          current.posts.push({
            subreddit: post.subreddit,
            upvotes: post.upvotes,
            url: post.url,
          });
          mentionedTitles.set(title, current);
        }
      }
    });

    // Convert to array and sort by mention count
    return Array.from(mentionedTitles.entries())
      .map(([title, data]) => ({
        title,
        mentions: data.count,
        topPost: data.posts.sort((a, b) => b.upvotes - a.upvotes)[0],
      }))
      .sort((a, b) => b.mentions - a.mentions);
  }

  // Calculate social score (0-100) based on Reddit engagement
  calculateSocialScore(mentions, upvotes, comments) {
    const mentionScore = Math.min(mentions * 10, 40); // Max 40 points
    const upvoteScore = Math.min(Math.log10(upvotes + 1) * 10, 40); // Max 40 points
    const commentScore = Math.min(Math.log10(comments + 1) * 5, 20); // Max 20 points

    return Math.min(mentionScore + upvoteScore + commentScore, 100);
  }

  // Search for a specific title in recent posts
  async searchTitle(title, subreddits = TARGET_SUBREDDITS, timeFilter = 'month') {
    if (!this.client) {
      return { found: false, score: 0 };
    }

    try {
      let totalMentions = 0;
      let totalUpvotes = 0;
      let totalComments = 0;

      for (const subreddit of subreddits) {
        try {
          const results = await this.client
            .getSubreddit(subreddit)
            .search({ query: title, time: timeFilter, limit: 10 });

          totalMentions += results.length;
          results.forEach(post => {
            totalUpvotes += post.ups;
            totalComments += post.num_comments;
          });
        } catch (error) {
          console.error(`Reddit search error in ${subreddit}:`, error.message);
        }
      }

      const score = this.calculateSocialScore(totalMentions, totalUpvotes, totalComments);

      return {
        found: totalMentions > 0,
        mentions: totalMentions,
        score,
        upvotes: totalUpvotes,
        comments: totalComments,
      };
    } catch (error) {
      console.error('Reddit title search error:', error.message);
      return { found: false, score: 0 };
    }
  }
}

module.exports = new RedditService();
