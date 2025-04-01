// Database connection configuration using Sequelize
const Sequelize = require('sequelize');

// Configuration for environment variables loaded from .env file
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Sequelize connection instance
let sequelize;

// Initialize database connection based on environment
// Creates connection using DATABASE_URL for Railway deployment
// or JAWSDB_URL for Heroku deployment
// or local credentials for development environment
if (process.env.DATABASE_URL) {
  // Railway.app configuration
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
  console.log('Using Railway MySQL configuration');
} else if (process.env.JAWSDB_URL) {
  // Heroku configuration (keeping for backward compatibility)
  sequelize = new Sequelize(process.env.JAWSDB_URL);
  console.log('Using JawsDB configuration');
} else {
  // Local development configuration
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
  console.log('Using local MySQL configuration');
}

// Exports Sequelize connection instance for use throughout the application
module.exports = sequelize;