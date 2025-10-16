// Database connection configuration using Sequelize
const Sequelize = require('sequelize');

// Configuration for environment variables loaded from .env file
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Custom logging function to show query execution time
const customLogger = (sql, timing) => {
  // Only log SELECT queries to avoid clutter (optional)
  if (sql.includes('SELECT')) {
    console.log(`[Query: ${timing}ms] ${sql.substring(0, 100)}...`);
  }
};

// Determine if we should log queries
const shouldLog = process.env.NODE_ENV !== 'production';

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
    },
    logging: shouldLog ? customLogger : false,  // Only log in development
    benchmark: shouldLog                        // Only benchmark in development
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
      logging: shouldLog ? customLogger : false,  // Only log in development
      benchmark: shouldLog                        // Only benchmark in development
    }
  );

// Log which configuration is being used
console.log(`Using ${process.env.DATABASE_URL ? 'Railway' : 'local'} MySQL configuration`);

// Export Sequelize connection instance for use throughout the application
module.exports = sequelize;