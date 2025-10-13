const session = require('express-session');
const { RedisStore } = require('connect-redis');
const crypto = require('crypto');
const createSessionRedisClient = require('./redisSession');

const createSessionConfig = async (isProd) => {
  const sessionRedisClient = await createSessionRedisClient();

  return {
    secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
    store: new RedisStore({
      client: sessionRedisClient,
      prefix: 'sess:',
      ttl: 86400 // 24 hours
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, 
      secure: isProd,
      sameSite: 'strict',
      path: '/'
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: 'sessionId',
    proxy: isProd,
    genid: () => crypto.randomBytes(32).toString('hex')
  };
};

module.exports = createSessionConfig;