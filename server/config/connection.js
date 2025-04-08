// Database connection configuration using Sequelize
const Sequelize = require('sequelize');

// Configuration for environment variables loaded from .env file
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Initialize database connection based on environment
// Either using DATABASE_URL for Railway deployment or local credentials for development
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );

// Log which configuration is being used
console.log(`Using ${process.env.DATABASE_URL ? 'Railway' : 'local'} MySQL configuration`);

// Export Sequelize connection instance for use throughout the application
module.exports = sequelize;