// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15 // 15 attempts per 15 minutes
});

const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25 // 25 posts per hour
});

const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50 // 50 comments per hour
});

module.exports = {
  loginLimiter,
  postLimiter,
  commentLimiter
};