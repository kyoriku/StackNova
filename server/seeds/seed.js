// Main database seeding script that coordinates the sequential creation of users, posts, and comments
const seedUsers = require('./userSeeds');
const seedPosts = require('./postSeeds');
const seedComments = require('./commentSeeds');
const sequelize = require('../config/connection');

// Seed all data in sequence
const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n\x1b[32m--- DATABASE SYNCED ---\x1b[0m\n');

  await seedUsers();
  console.log('\n\x1b[32m--- USERS SEEDED ---\x1b[0m\n');

  await seedPosts();
  console.log('\n\x1b[32m--- POSTS SEEDED ---\x1b[0m\n');

  await seedComments();
  console.log('\n\x1b[32m--- COMMENTS SEEDED ---\x1b[0m\n');

  process.exit(0);
};

seedAll();