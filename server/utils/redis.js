// utils/redis.js
const { createClient } = require('redis');

// Create Redis client with URL from env or default
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Cache duration in seconds
const CACHE_TTL = 3600; // 1 hour

// Log Redis errors without crashing
client.on('error', err => {
  console.log('Redis Client Error:', err);
});

// Connection retry logic
let retries = 5;
const connectWithRetry = async () => {
  while (retries) {
    try {
      await client.connect();
      console.log('Redis connected successfully');
      break;
    } catch (err) {
      console.log(`Redis connection attempt ${6 - retries}/5 failed`);
      retries -= 1;
      if (retries === 0) {
        console.log('Redis connection failed after 5 attempts');
        // Don't throw error, let app continue without caching
        break;
      }
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Initial connection attempt
connectWithRetry();

const redisService = {
  // Get cached data with error handling
  async get(key) {
    try {
      if (!client.isReady) return null;
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null; // Return null on error to fallback to database
    }
  },

  // Set cache with error handling
  async set(key, data) {
    try {
      if (!client.isReady) return;
      await client.setEx(key, CACHE_TTL, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
      // Continue without caching
    }
  },

  // Delete specific cache
  async del(key) {
    try {
      if (!client.isReady) return;
      await client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  },

  // Clear post and its comments
  async clearPostCache(postId) {
    try {
      if (!client.isReady) return;
      const keys = [
        `post:${postId}`,
        `comments:${postId}`,
        'posts:all'
      ];
      await Promise.all(keys.map(key => client.del(key)));
    } catch (error) {
      console.error('Redis clear post cache error:', error);
    }
  },

  // Clear all posts
  async clearAllPostsCache() {
    try {
      if (!client.isReady) return;
      const keys = await client.keys('post:*');
      if (keys.length > 0) {
        await Promise.all(keys.map(key => client.del(key)));
      }
      await client.del('posts:all');
    } catch (error) {
      console.error('Redis clear all posts error:', error);
    }
  },

  // Check if Redis is connected
  isConnected() {
    return client.isReady;
  }
};

module.exports = redisService;