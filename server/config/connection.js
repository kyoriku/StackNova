// Database connection configuration using Sequelize
const Sequelize = require('sequelize');

// Configuration for environment variables loaded from .env file
require('dotenv').config();

// Sequelize connection instance
let sequelize;

// Initialize database connection based on environment
// Creates connection using JAWSDB_URL for Heroku deployment
// or local credentials for development environment
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

// Exports Sequelize connection instance for use throughout the application
module.exports = sequelize;