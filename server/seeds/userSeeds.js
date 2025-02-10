// Seed data for creating initial user accounts in the database
const { User } = require('../models');

const userData = [
  {
    username: 'sarah.codes',
    email: 'sarah.mitchell@gmail.com',
    password: 'hashedPassword123'
  },
  {
    username: 'dev_alex',
    email: 'alex.kumar@outlook.com',
    password: 'hashedPassword456'
  },
  {
    username: 'emma_writes',
    email: 'emma.chen@yahoo.com',
    password: 'hashedPassword789'
  },
  {
    username: 'carlos_dev',
    email: 'carlos.rodriguez@hotmail.com',
    password: 'hashedPasswordABC'
  },
  {
    username: 'tech_mia',
    email: 'mia.patel@protonmail.com',
    password: 'hashedPasswordDEF'
  }
];

// Bulk create users with password hashing hooks
const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;