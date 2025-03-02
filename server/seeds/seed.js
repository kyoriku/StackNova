// Main database seeding script
const { User } = require('../models');
const seedUsers = require('./userSeeds');
const seedPosts = require('./postSeeds');
const seedComments = require('./commentSeeds');
const sequelize = require('../config/connection');
const redisService = require('../config/redis');

// Clear Redis cache before seeding data
const clearRedisCache = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!redisService.isConnected()) {
      console.log('\n\x1b[33m--- REDIS NOT CONNECTED, SKIPPING CACHE CLEAR ---\x1b[0m\n');
      return;
    }

    await redisService.clearAllPostsCache();
    console.log('\n\x1b[32m--- REDIS POSTS CACHE CLEARED ---\x1b[0m\n');

    // Fetch all usernames from the User model
    const users = await User.findAll({ attributes: ['username'] });
    const usernames = users.map(user => user.username);

    await Promise.all(usernames.map(username => redisService.clearUserProfileCache(username)));
    console.log('\n\x1b[32m--- REDIS USER PROFILES CACHE CLEARED ---\x1b[0m\n');

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

    const users = await seedUsers();
    console.log('\n\x1b[32m--- USERS SEEDED ---\x1b[0m\n');

    const posts = await seedPosts(users);
    console.log('\n\x1b[32m--- POSTS SEEDED ---\x1b[0m\n');

    await seedComments(users, posts);
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