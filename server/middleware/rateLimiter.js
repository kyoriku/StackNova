const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { createClient } = require('redis');

// Determine Redis connection URL based on environment
const getRedisUrl = () => {
  if (process.env.REDIS_URL && process.env.REDIS_PASSWORD) {
    const [host, port] = process.env.REDIS_URL.split(':');
    return `redis://:${process.env.REDIS_PASSWORD}@${host}:${port}`;
  }
  return process.env.REDIS_URL || 'redis://localhost:6379';
};

// Create Redis client for rate limiting
const redisClient = createClient({
  url: getRedisUrl(),
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error('Redis rate limiter: Max retries reached');
        return new Error('Max retries reached');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Rate Limiter Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Rate Limiter connected');
});

// Connect to Redis (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  redisClient.connect().catch(console.error);
}

// General API rate limiter (applies to all requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis if available, otherwise fall back to memory store
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }
});

// Login rate limiter (by IP only, since user isn't authenticated yet)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:login:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts. Please try again later.'
    });
  }
});

// Post creation rate limiter (by user ID if authenticated, otherwise IP)
const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // 25 posts per hour
  standardHeaders: true,
  legacyHeaders: false,
  // Key by user ID for authenticated users, otherwise by IP
  keyGenerator: (req) => {
    return req.session?.user_id ? `user:${req.session.user_id}` : `ip:${req.ip}`;
  },
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:post:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many posts created. Please try again in an hour.'
    });
  },
  // Skip failed requests (don't count them against the limit)
  skipFailedRequests: true
});

// Comment creation rate limiter (by user ID if authenticated, otherwise IP)
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 comments per hour
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.session?.user_id ? `user:${req.session.user_id}` : `ip:${req.ip}`;
  },
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:comment:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many comments created. Please try again in an hour.'
    });
  },
  skipFailedRequests: true
});

// OAuth-specific rate limiting (by IP only)
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 OAuth attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:oauth:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.'
    });
  }
});

// Read operations rate limiter (prevent scraping)
const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 read requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:read:'
  }) : undefined,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please slow down.'
    });
  },
  // Only apply to GET requests
  skip: (req) => req.method !== 'GET'
});

module.exports = {
  apiLimiter,
  loginLimiter,
  postLimiter,
  commentLimiter,
  oauthLimiter,
  readLimiter
};