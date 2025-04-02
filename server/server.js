// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');
// require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// const routes = require('./routes');
// const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const app = express();
// const PORT = process.env.PORT || 3001;

// // CORS Configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production'
//     ? process.env.FRONTEND_URL
//     : ['http://localhost:3000', 'http://10.88.111.4:3000'],  // Allow both local and network access
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

// // Session configuration
// const sess = {
//   secret: process.env.SESSION_SECRET,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
//     path: '/',
//   },
//   resave: false,
//   saveUninitialized: false,
//   store: new SequelizeStore({
//     db: sequelize
//   }),
//   name: 'sessionId',
//   proxy: process.env.NODE_ENV === 'production'
// };

// console.log('Server running in', process.env.NODE_ENV || 'development', 'mode');

// app.use(session(sess));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const routes = require('./routes');
const healthRoutes = require('./routes/healthRoutes'); // Import health routes directly
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Extract domain for cookie settings
const getMainDomain = () => {
  if (process.env.NODE_ENV !== 'production') return undefined;
  
  if (!process.env.FRONTEND_URL) return undefined;
  
  try {
    const url = new URL(process.env.FRONTEND_URL);
    // If it's a custom domain like stacknova.ca, return .stacknova.ca
    // If it's a railway domain, return undefined
    if (url.hostname.includes('railway.app')) return undefined;
    
    // For custom domains, we prefix with a dot to include subdomains
    return '.' + url.hostname;
  } catch (e) {
    console.error('Error parsing FRONTEND_URL:', e);
    return undefined;
  }
};

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || true // Use the frontend URL or allow all origins in production
    : ['http://localhost:3000'],  // Allow local network in development
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS first
app.use(cors(corsOptions));

// Then basic Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add health check routes BEFORE session middleware
// This ensures health check works even if there are session issues
app.use('/api', healthRoutes);

// Determine appropriate sameSite setting based on domain configuration
const determineSameSite = () => {
  if (process.env.NODE_ENV !== 'production') return 'lax';
  
  const domain = getMainDomain();
  // If we have a shared main domain (.example.com), we can use 'lax'
  // Otherwise use 'none' for cross-domain requests
  return domain ? 'lax' : 'none';
};

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: determineSameSite(),
    domain: getMainDomain(),
    path: '/',
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  }),
  name: 'sessionId',
  proxy: process.env.NODE_ENV === 'production'
};

console.log('Server running in', process.env.NODE_ENV || 'development', 'mode');
console.log('CORS origin configuration:', corsOptions.origin);
console.log('Cookie settings:', {
  secure: sess.cookie.secure,
  sameSite: sess.cookie.sameSite,
  domain: sess.cookie.domain || '(not set)'
});

// Set up session middleware
app.use(session(sess));

// Then add the rest of the routes that need session
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  });
});