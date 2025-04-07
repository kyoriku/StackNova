const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const routes = require('./routes');
const healthRoutes = require('./routes/healthRoutes');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// CORS configuration
const corsOptions = {
  origin: isProd ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes before session middleware
app.use('/', healthRoutes);

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/'
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  }),
  name: 'sessionId',
  proxy: isProd
};

// Log environment info
console.log(`Server running in ${isProd ? 'production' : 'development'} mode`);
console.log('CORS origin:', corsOptions.origin);
console.log('Cookie settings:', {
  secure: sess.cookie.secure,
  sameSite: sess.cookie.sameSite
});

// Set up session middleware
app.use(session(sess));

// Serve static files in production
if (isProd) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// API routes
app.use(routes);

// Catch-all route for SPA
if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
    if (isProd) {
      console.log(`Frontend served from: ${path.join(__dirname, '../client/dist')}`);
    }
  });
});