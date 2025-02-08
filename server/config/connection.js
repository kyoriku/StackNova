// Import Sequelize for database connection
const Sequelize = require('sequelize');

// Load environment variables from a .env file
require('dotenv').config();

// Declare a variable to hold the Sequelize connection
let sequelize;

// Check if a JAWSDB_URL environment variable is present (indicating a Heroku deployment)
if (process.env.JAWSDB_URL) {
  // If JAWSDB_URL is present, create a Sequelize connection using the provided URL (Heroku deployment)
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // If JAWSDB_URL is not present, create a Sequelize connection using local database credentials
  sequelize = new Sequelize(
    process.env.DB_NAME,     // Database name
    process.env.DB_USER,     // MySQL username
    process.env.DB_PASSWORD, // MySQL password
    {
      host: 'localhost',      // Hostname of the MySQL server
      dialect: 'mysql',       // Specify the dialect (in this case, MySQL)
      port: 3306              // Port number to connect to the MySQL server
    }
  );
}

// Export the Sequelize connection for use in other parts of the application
module.exports = sequelize;
