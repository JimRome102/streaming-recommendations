const express = require('express');
const prisma = require('../config/database');
const watchmodeService = require('../services/external/watchmodeService');

const router = express.Router();

// Refresh streaming data for cached content
router.post('/refresh-streaming', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get cached items without streaming data
    const items = await prisma.cachedContent.findMany({
      where: {
        OR: [
          { streamingPlatforms: null },
          { streamingPlatforms: { equals: null } }
        ]
      },
      take: parseInt(limit),
      orderBy: { popularity: 'desc' }
    });

    console.log(`Found ${items.length} items without streaming data`);

    let updated = 0;
    let failed = 0;

    for (const item of items) {
      try {
        let streaming = null;

        // Try IMDb ID first, then title
        if (item.imdbId) {
          streaming = await watchmodeService.getStreamingAvailabilityByImdbId(item.imdbId);
        } else {
          streaming = await watchmodeService.getStreamingAvailabilityByTitle(item.title, item.mediaType);
        }

        if (streaming) {
          await prisma.cachedContent.update({
            where: { id: item.id },
            data: { streamingPlatforms: streaming }
          });
          updated++;
        } else {
          failed++;
        }

        // Rate limit: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to update ${item.title}:`, error.message);
        failed++;
      }
    }

    res.json({
      success: true,
      processed: items.length,
      updated,
      failed,
      message: `Updated streaming data for ${updated} items`
    });
  } catch (error) {
    console.error('Refresh streaming error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
