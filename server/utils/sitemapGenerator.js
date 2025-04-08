// // utils/sitemapGenerator.js
// const { SitemapStream, streamToPromise } = require('sitemap');
// const { Readable } = require('stream');
// const { Post, User } = require('../models'); // Adjust path to match your models folder
// const redisService = require('../config/redis');

// const SITEMAP_CACHE_KEY = 'sitemap:xml';
// const SITEMAP_CACHE_TTL = 86400; // 24 hours in seconds

// async function generateSitemap(req) {
//   try {
//     // Check cache first
//     const cachedSitemap = await redisService.get(SITEMAP_CACHE_KEY);
//     if (cachedSitemap && client.isReady) {
//       return cachedSitemap;
//     }

//     // Build the base URL from the request
//     const protocol = req.protocol;
//     const host = req.get('host');
//     const baseUrl = `${protocol}://${host}`;

//     // Create a sitemap stream
//     const sitemapStream = new SitemapStream({ 
//       hostname: baseUrl 
//     });

//     // Add static routes
//     sitemapStream.write({ 
//       url: '/', 
//       changefreq: 'daily', 
//       priority: 1.0 
//     });

//     // Get all published posts
//     const posts = await Post.findAll({
//       attributes: ['id', 'updatedAt']
//     });

//     // Add post routes
//     for (const post of posts) {
//       sitemapStream.write({
//         url: `/post/${post.id}`,
//         lastmod: post.updatedAt.toISOString(),
//         changefreq: 'weekly',
//         priority: 0.8
//       });
//     }

//     // Get all users
//     const users = await User.findAll({
//       attributes: ['username', 'updatedAt']
//     });

//     // Add user profile routes
//     for (const user of users) {
//       sitemapStream.write({
//         url: `/user/${user.username}`,
//         lastmod: user.updatedAt ? user.updatedAt.toISOString() : undefined,
//         changefreq: 'weekly',
//         priority: 0.6
//       });
//     }

//     // End the stream
//     sitemapStream.end();

//     // Generate sitemap as XML
//     const sitemap = await streamToPromise(Readable.from(sitemapStream));
//     const sitemapXml = sitemap.toString();

//     // Cache the sitemap
//     if (redisService.isConnected()) {
//       await redisService.set(SITEMAP_CACHE_KEY, sitemapXml, SITEMAP_CACHE_TTL);
//     }

//     return sitemapXml;
//   } catch (error) {
//     console.error('Error generating sitemap:', error);
//     throw error;
//   }
// }

// // Function to invalidate sitemap cache after content changes
// async function invalidateSitemapCache() {
//   try {
//     if (redisService.isConnected()) {
//       await client.del(SITEMAP_CACHE_KEY);
//       if (process.env.NODE_ENV === 'development') {
//         console.log('\x1b[36m%s\x1b[0m', 'Invalidated sitemap cache');
//       }
//     }
//   } catch (error) {
//     console.error('Error invalidating sitemap cache:', error);
//   }
// }

// module.exports = { 
//   generateSitemap,
//   invalidateSitemapCache
// };

// utils/sitemapGenerator.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { Post } = require('../models');
const redisService = require('../config/redis');

const SITEMAP_CACHE_KEY = 'sitemap:xml';
const SITEMAP_CACHE_TTL = 86400; // 24 hours in seconds

async function generateSitemap(req) {
  try {
    // Check cache first
    const cachedSitemap = await redisService.get(SITEMAP_CACHE_KEY);
    if (cachedSitemap && redisService.isConnected()) {
      return cachedSitemap;
    }

    // Build the base URL from the request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Create a sitemap stream
    const sitemapStream = new SitemapStream({
      hostname: baseUrl
    });

    // Add static routes
    sitemapStream.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    });

    // Get all posts
    const posts = await Post.findAll({
      attributes: ['id', 'updatedAt']
    });

    // Add post routes
    for (const post of posts) {
      sitemapStream.write({
        url: `/post/${post.id}`,
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