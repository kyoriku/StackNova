const express = require('express');
const router = express.Router();
const { createClient } = require('redis');
const { User, Post, Comment } = require('../models'); // <-- ADD THIS!

// POST version (original)
router.post('/unban-me', async (req, res) => {
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  try {
    await client.connect();
    await client.del(`badbot:${req.ip}`);
    await client.del(`bot_attempts:${req.ip}`);
    await client.del(`bot_subnet:${req.ip.split('.').slice(0, 3).join('.')}`);
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
    await client.del(`bot_subnet:${req.ip.split('.').slice(0, 3).join('.')}`);
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

// Clear test data
router.delete('/clear-test-data', async (req, res) => {
  try {
    const testEmails = ['k6test1@example.com', 'k6test2@example.com', 'k6test3@example.com'];
    
    // Find test users
    const testUsers = await User.findAll({
      where: { email: testEmails }
    });
    
    if (testUsers.length === 0) {
      return res.json({ 
        message: 'No test users found',
        deletedUsers: 0
      });
    }
    
    const userIds = testUsers.map(u => u.id);
    
    // Delete their comments
    const deletedComments = await Comment.destroy({ 
      where: { user_id: userIds } 
    });
    
    // Delete their posts
    const deletedPosts = await Post.destroy({ 
      where: { user_id: userIds } 
    });
    
    // Optionally delete the users themselves
    const deletedUsers = await User.destroy({
      where: { email: testEmails }
    });
    
    res.json({ 
      message: 'Test data cleared successfully',
      deletedUsers: deletedUsers,
      deletedPosts: deletedPosts,
      deletedComments: deletedComments
    });
  } catch (error) {
    console.error('Error clearing test data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;