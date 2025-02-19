// Main database seeding script
const seedUsers = require('./userSeeds');
const seedPosts = require('./postSeeds');
const seedComments = require('./commentSeeds');
const sequelize = require('../config/connection');
const redisService = require('../config/redis');

// Clear Redis cache before seeding data
const clearRedisCache = async () => {
  try {
    // Wait for a moment to allow Redis connection to establish
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!redisService.isConnected()) {
      console.log('\n\x1b[33m--- REDIS NOT CONNECTED, SKIPPING CACHE CLEAR ---\x1b[0m\n');
      return;
    }

    await redisService.clearAllPostsCache();
    console.log('\n\x1b[32m--- REDIS CACHE CLEARED ---\x1b[0m\n');
  } catch (err) {
    console.error('\n\x1b[31m--- REDIS CACHE CLEARING FAILED ---\x1b[0m\n', err);
  }
};

// Seed all data in sequence
const seedAll = async () => {
  try {
    // Clear Redis cache first
    await clearRedisCache();

    // Then proceed with database seeding
    await sequelize.sync({ force: true });
    console.log('\n\x1b[32m--- DATABASE SYNCED ---\x1b[0m\n');

    await seedUsers();
    console.log('\n\x1b[32m--- USERS SEEDED ---\x1b[0m\n');

    await seedPosts();
    console.log('\n\x1b[32m--- POSTS SEEDED ---\x1b[0m\n');

    await seedComments();
    console.log('\n\x1b[32m--- COMMENTS SEEDED ---\x1b[0m\n');

    // Explicitly disconnect Redis before exiting
    if (redisService.isConnected()) {
      await redisService.disconnect();
    }

    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m--- SEEDING FAILED ---\x1b[0m\n', error);
    
    // Ensure Redis disconnects even on error
    if (redisService.isConnected()) {
      await redisService.disconnect();
    }
    
    process.exit(1);
  }
};

seedAll();