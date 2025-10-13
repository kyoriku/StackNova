const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { Post } = require('../models');
const redisService = require('../config/redisCache');

const SITEMAP_CACHE_KEY = 'sitemap:xml';
const SITEMAP_CACHE_TTL = 86400; // 24 hours

async function generateSitemap(req) {
  try {
    // Check cache first
    const cachedSitemap = await redisService.get(SITEMAP_CACHE_KEY);
    if (cachedSitemap && redisService.isConnected()) {
      return cachedSitemap;
    }

    // Build the base URL from the request
    let protocol = req.protocol;
    const host = req.get('host');

    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      protocol = 'https';
    }

    const baseUrl = `${protocol}://${host}`;

    // Create a sitemap stream
    const sitemapStream = new SitemapStream({
      hostname: baseUrl
    });

    // Add homepage
    sitemapStream.write({
      url: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    });

    // Get all posts with slugs
    const posts = await Post.findAll({
      attributes: ['id', 'slug', 'updatedAt'],
      where: {
        slug: {
          [require('sequelize').Op.not]: null // Only include posts with slugs
        }
      },
      order: [['updatedAt', 'DESC']] // Most recent first
    });

    // Add post routes using slugs
    for (const post of posts) {
      // Skip posts without slugs (shouldn't happen, but safety check)
      if (!post.slug) {
        console.warn(`Post ${post.id} missing slug, skipping from sitemap`);
        continue;
      }

      sitemapStream.write({
        url: `/post/${post.slug}`,
        lastmod: post.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      });
    }

    // End the stream
    sitemapStream.end();

    // Generate sitemap as XML
    const sitemap = await streamToPromise(Readable.from(sitemapStream));
    const sitemapXml = sitemap.toString();

    // Cache the sitemap
    if (redisService.isConnected()) {
      await redisService.set(SITEMAP_CACHE_KEY, sitemapXml, SITEMAP_CACHE_TTL);
    }

    console.log(`Generated sitemap with ${posts.length + 1} URLs`);
    return sitemapXml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Function to invalidate sitemap cache after content changes
async function invalidateSitemapCache() {
  try {
    if (redisService.isConnected()) {
      await redisService.del(SITEMAP_CACHE_KEY);
      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', 'Invalidated sitemap cache');
      }
    }
  } catch (error) {
    console.error('Error invalidating sitemap cache:', error);
  }
}

module.exports = {
  generateSitemap,
  invalidateSitemapCache
};