const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

// POST version (original)
router.post('/unban-me', async (req, res) => {
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  try {
    await client.connect();
    await client.del(`badbot:${req.ip}`);
    await client.del(`bot_attempts:${req.ip}`);
    await client.quit();
    res.json({ message: 'You are unbanned!', ip: req.ip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET version (easier to use in browser)
router.get('/unban-me', async (req, res) => {
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  try {
    await client.connect();
    await client.del(`badbot:${req.ip}`);
    await client.del(`bot_attempts:${req.ip}`);
    await client.quit();
    res.json({ message: 'You are unbanned!', ip: req.ip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: Cache status endpoint
router.get('/cache-status', (req, res) => {
  const cache = require('../config/redisCache');
  res.json({
    cacheConnected: cache.isConnected(),
    ip: req.ip,
    session: req.session
  });
});

module.exports = router;