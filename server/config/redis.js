// config/redis.js
const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const CACHE_TTL = 3600; // 1 hour

client.on('error', err => {
  console.log('Redis Client Error:', err);
});

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
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

connectWithRetry();

const redisService = {
  async get(key) {
    try {
      if (!client.isReady) return null;
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key, data, ttl = CACHE_TTL) {
    try {
      if (!client.isReady) return;
      await client.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },

  // For single post updates/deletes
  async clearPostCache(postId, includeComments = false) {
    try {
      if (!client.isReady) return;

      const cachesToClear = [client.del(`post:${postId}`)];

      if (includeComments) {
        cachesToClear.push(client.del(`comments:${postId}`));
      }

      await Promise.all(cachesToClear);

      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', `Cleared cache for post:`, postId);
      }
    } catch (error) {
      console.error('Redis clear post cache error:', error);
    }
  },

  // For user's post list only
  async clearUserPostsCache(userId) {
    try {
      if (!client.isReady) return;
      await client.del(`user:${userId}:posts`);

      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', `Cleared user posts cache for user:`, userId);
      }
    } catch (error) {
      console.error('Redis clear user posts cache error:', error);
    }
  },

  // Only clear home feed cache
  async clearHomePageCache() {
    try {
      if (!client.isReady) return;
      await client.del('posts:all');

      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', `Cleared home page cache`);
      }
    } catch (error) {
      console.error('Redis clear home page error:', error);
    }
  },

  // Clear all post caches 
  async clearAllPostsCache() {
    try {
      if (!client.isReady) return;
      const keys = await client.keys('post:*');
      const userKeys = await client.keys('user:*:posts');
      const allKeys = [...keys, ...userKeys, 'posts:all'];
      if (allKeys.length > 0) {
        await Promise.all(allKeys.map(key => client.del(key)));
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', `Cleared all posts caches. Keys:`, allKeys);
      }
    } catch (error) {
      console.error('Redis clear all posts error:', error);
    }
  },

  isConnected() {
    return client.isReady;
  },

  async disconnect() {
    try {
      if (client.isReady) {
        await client.quit();
        console.log('\n\x1b[32m--- REDIS DISCONNECTED ---\x1b[0m\n');
      }
    } catch (error) {
      console.error('\n\x1b[31m--- REDIS DISCONNECT FAILED ---\x1b[0m\n', error);
    }
  }
};

module.exports = redisService;