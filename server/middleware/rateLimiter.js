const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');
const { trackSuspiciousActivity } = require('./botHoneypot');

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
  console.log('Redis Rate Limiter Connected');
});

// Connect to Redis (RedisStore will wait for connection)
if (process.env.NODE_ENV !== 'test') {
  redisClient.connect().catch((err) => {
    console.error('Redis Rate Limiter failed to connect:', err);
  });
}

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }
});

// Login rate limiter with bot tracking
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: async (req, res) => {
    // Track as high-severity - likely credential stuffing attack
    await trackSuspiciousActivity(req.ip, req.path, 'high');
    res.status(429).json({
      error: 'Too many login attempts. Please try again later.'
    });
  }
});

// Post creation rate limiter
const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // limit each IP to 25 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.session?.user_id ? `user:${req.session.user_id}` : `ip:${req.ip}`;
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:post:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many posts created. Please try again in an hour.'
    });
  },
  skipFailedRequests: true
});

// Comment creation rate limiter
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.session?.user_id ? `user:${req.session.user_id}` : `ip:${req.ip}`;
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:comment:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many comments created. Please try again in an hour.'
    });
  },
  skipFailedRequests: true
});

// OAuth-specific rate limiting with bot tracking
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:oauth:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: async (req, res) => {
    // Track as high-severity - likely OAuth abuse
    await trackSuspiciousActivity(req.ip, req.path, 'high');
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.'
    });
  }
});

// Read operations rate limiter
const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:read:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please slow down.'
    });
  },
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