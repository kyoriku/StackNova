// Main server configuration and initialization file
const express = require('express');
const session = require('express-session');
require('dotenv').config();

// Import routes and database configuration
const routes = require('./routes');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Initialize Express application and port configuration
const app = express();
const PORT = process.env.PORT || 3001;

// Session configuration for user authentication
// Includes security settings for cookies and session storage
// Uses Sequelize to persist session data in the database
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Log current server environment
console.log('Server running in', process.env.NODE_ENV || 'development', 'mode');

// Middleware configuration
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use(routes);

// Initialize database connection and start server
// force: false prevents database from being dropped and recreated
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});