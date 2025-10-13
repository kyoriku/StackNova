const router = require('express').Router();
const sequelize = require('../config/connection');
const redisService = require('../config/redisCache');

// Health check endpoint for Railway deployment monitoring
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();

    // Create status object
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected'
    };

    // Check Redis connection if available
    if (redisService.isConnected()) {
      status.redis = 'Connected';
    } else {
      status.redis = 'Not connected';
    }

    res.json(status);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;