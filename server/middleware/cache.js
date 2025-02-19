// middleware/cache.js
const redisService = require('../config/redis');

const cacheMiddleware = async (req, res, next) => {
  try {
    let cacheKey;
    if (req.path.includes('/user/posts')) {
      cacheKey = `user:${req.session.user_id}:posts`;
    } else if (req.baseUrl.includes('posts')) {
      cacheKey = req.params.id ? `post:${req.params.id}` : 'posts:all';
    } else if (req.baseUrl.includes('comments')) {
      cacheKey = `comments:${req.params.postId}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('\x1b[35m%s\x1b[0m', `Cache key for request:`, {
        path: req.path,
        baseUrl: req.baseUrl,
        cacheKey,
        method: req.method
      });
    }

    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[32m%s\x1b[0m', `Cache HIT: ${cacheKey}`);
      }
      return res.json(cachedData);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('\x1b[33m%s\x1b[0m', `Cache MISS - Fetching from DB: ${cacheKey}`);
    }

    const originalJson = res.json;

    res.json = function (data) {
      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m%s\x1b[0m', `Caching data for: ${cacheKey}`);
      }
      redisService.set(cacheKey, data);
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Cache error: ${error}`);
    next();
  }
};

module.exports = cacheMiddleware;