// // const express = require('express');
// // const session = require('express-session');
// // const cors = require('cors');
// // const path = require('path');
// // require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
// // const routes = require('./routes');
// // const healthRoutes = require('./routes/healthRoutes');
// // const sequelize = require('./config/connection');
// // const SequelizeStore = require('connect-session-sequelize')(session.Store);
// // const { apiLimiter, readLimiter } = require('./middleware/rateLimiter');
// // const { checkBannedIP, botHoneypot } = require('./middleware/botHoneypot');
// // const app = express();
// // const PORT = process.env.PORT || 3001;
// // const isProd = process.env.NODE_ENV === 'production';

// // // Trust proxy - required for Railway/Heroku/etc to get real client IPs
// // if (isProd) {
// //   app.set('trust proxy', 1); // Trust first proxy
// // }

// // // CORS configuration
// // const corsOptions = {
// //   origin: isProd ? process.env.FRONTEND_URL : 'http://localhost:3000',
// //   credentials: true,
// //   optionsSuccessStatus: 200
// // };

// // // Apply middleware
// // app.use(cors(corsOptions));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // Health check routes before session middleware
// // app.use('/', healthRoutes);

// // // Session configuration
// // const sess = {
// //   secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
// //   cookie: {
// //     maxAge: 24 * 60 * 60 * 1000, // 24 hours
// //     httpOnly: true,
// //     secure: isProd,
// //     sameSite: 'strict',
// //     path: '/'
// //   },
// //   resave: false,
// //   saveUninitialized: false,
// //   store: new SequelizeStore({
// //     db: sequelize
// //   }),
// //   name: 'sessionId',
// //   proxy: isProd
// // };

// // // Log environment info
// // console.log(`Server running in ${isProd ? 'production' : 'development'} mode`);
// // console.log('CORS origin:', corsOptions.origin);
// // console.log('Cookie settings:', {
// //   secure: sess.cookie.secure,
// //   sameSite: sess.cookie.sameSite
// // });

// // // Set up session middleware
// // app.use(session(sess));

// // // Apply general rate limiters to ALL routes
// // app.use(apiLimiter);  // 1000 requests per 15min per IP
// // app.use(readLimiter); // 100 GET requests per minute

// // // DEVELOPMENT ONLY: Route to unban yourself (MUST be before checkBannedIP!)
// // if (!isProd) {
// //   app.post('/api/dev/unban-me', async (req, res) => {
// //     const { createClient } = require('redis');
// //     const client = createClient({
// //       url: process.env.REDIS_URL || 'redis://localhost:6379'
// //     });
    
// //     try {
// //       await client.connect();
// //       await client.del(`badbot:${req.ip}`);
// //       await client.del(`bot_attempts:${req.ip}`);
// //       await client.quit();
// //       res.json({ message: 'You are unbanned!', ip: req.ip });
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   });
// // }

// // // Check if IP is banned before processing any routes
// // app.use(checkBannedIP);

// // // Middleware to set headers for favicon
// // app.use((req, res, next) => {
// //   if (req.path === '/favicon.svg') {
// //     res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
// //     res.setHeader('X-Content-Type-Options', 'nosniff');
// //   }
// //   next();
// // });

// // // Serve static files in production
// // if (isProd) {
// //   app.use(express.static(path.join(__dirname, '../client/dist')));
// // }

// // // API routes
// // app.use(routes);

// // // Catch non-existent API routes (honeypot)
// // app.use(botHoneypot);

// // // UUID redirect route (only in production, before catch-all)
// // if (isProd) {
// //   const { Post } = require('./models');

// //   // Helper function to check if string is UUID
// //   const isUUID = (str) => {
// //     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// //     return uuidRegex.test(str);
// //   };

// //   app.get('/post/:identifier', async (req, res, next) => {
// //     const identifier = req.params.identifier;

// //     // Only handle if it's a UUID
// //     if (!isUUID(identifier)) {
// //       return next(); // Let React handle slug URLs
// //     }

// //     try {
// //       // Look up the post by UUID
// //       const post = await Post.findOne({
// //         where: { id: identifier },
// //         attributes: ['slug']
// //       });

// //       if (!post) {
// //         return next(); // Let React handle 404
// //       }

// //       // SEO-friendly 301 redirect to slug URL
// //       return res.redirect(301, `/post/${post.slug}`);
// //     } catch (error) {
// //       console.error('Error in UUID redirect:', error);
// //       return next(); // Let React handle the error
// //     }
// //   });
// // }

// // // Catch-all route for SPA (production and development)
// // app.get('*', (req, res) => {
// //   if (isProd) {
// //     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// //   } else {
// //     // In dev, return 404 for unknown routes
// //     res.status(404).json({ error: 'Not Found' });
// //   }
// // });

// // // Start server
// // sequelize.sync({ force: false }).then(() => {
// //   app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// //     console.log(`Health check available at: http://localhost:${PORT}/health`);
// //     if (isProd) {
// //       console.log(`Frontend served from: ${path.join(__dirname, '../client/dist')}`);
// //     }
// //   });
// // });

// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');
// const crypto = require('crypto');
// const path = require('path');
// require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
// const routes = require('./routes');
// const healthRoutes = require('./routes/healthRoutes');
// const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const { apiLimiter, readLimiter } = require('./middleware/rateLimiter');
// const { sessionSecurity, checkInactivity } = require('./middleware/sessionSecurity');
// const { checkBannedIP, botHoneypot } = require('./middleware/botHoneypot');
// const helmet = require('helmet');
// const app = express();
// const PORT = process.env.PORT || 3001;
// const isProd = process.env.NODE_ENV === 'production';

// // Trust proxy - required for Railway/Heroku/etc to get real client IPs
// if (isProd) {
//   app.set('trust proxy', 1);
// }

// // CORS configuration
// const corsOptions = {
//   origin: isProd ? process.env.FRONTEND_URL : 'http://localhost:3000',
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// // Security headers
// if (isProd) {
//   app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         imgSrc: ["'self'", "data:"],
//         connectSrc: ["'self'"],
//         fontSrc: ["'self'", "data:"],
//         objectSrc: ["'none'"],
//         mediaSrc: ["'self'"],
//         frameSrc: ["'none'"],
//       },
//     },
//     crossOriginEmbedderPolicy: false,
//   }));
// } else {
//   app.use(helmet({
//     contentSecurityPolicy: false, // Easier debugging in dev
//   }));
// }

// // Apply middleware
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health check routes before session middleware
// app.use('/', healthRoutes);

// // Session configuration with enhanced security
// const sess = {
//   secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     httpOnly: true,
//     secure: isProd,
//     sameSite: 'strict',
//     path: '/'
//   },
//   resave: false,
//   saveUninitialized: false,
//   rolling: true, // Reset maxAge on every request
//   store: new SequelizeStore({
//     db: sequelize,
//     checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 min
//     expiration: 24 * 60 * 60 * 1000 // 24 hours
//   }),
//   name: 'sessionId',
//   proxy: isProd,
//   // Generate cryptographically strong session IDs
//   genid: () => crypto.randomBytes(16).toString('hex')
// };

// // Log environment info
// console.log(`Server running in ${isProd ? 'production' : 'development'} mode`);
// console.log('CORS origin:', corsOptions.origin);
// console.log('Session settings:', {
//   secure: sess.cookie.secure,
//   sameSite: sess.cookie.sameSite,
//   maxAge: sess.cookie.maxAge / 1000 / 60 / 60 + ' hours'
// });

// // Set up session middleware
// app.use(session(sess));

// // Session security middleware (after session, before routes)
// app.use(sessionSecurity);
// app.use(checkInactivity);

// // Apply general rate limiters to ALL routes
// app.use(apiLimiter);
// app.use(readLimiter);

// // DEVELOPMENT ONLY: Route to unban yourself
// if (!isProd) {
//   app.post('/api/dev/unban-me', async (req, res) => {
//     const { createClient } = require('redis');
//     const client = createClient({
//       url: process.env.REDIS_URL || 'redis://localhost:6379'
//     });
    
//     try {
//       await client.connect();
//       await client.del(`badbot:${req.ip}`);
//       await client.del(`bot_attempts:${req.ip}`);
//       await client.quit();
//       res.json({ message: 'You are unbanned!', ip: req.ip });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// }

// // Check if IP is banned before processing any routes
// app.use(checkBannedIP);

// // Middleware to set headers for favicon
// app.use((req, res, next) => {
//   if (req.path === '/favicon.svg') {
//     res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//   }
//   next();
// });

// // Serve static files in production
// if (isProd) {
//   app.use(express.static(path.join(__dirname, '../client/dist')));
// }

// // Main routes - no CSRF middleware needed!
// app.use(routes);

// // Catch non-existent API routes (honeypot)
// app.use(botHoneypot);

// // UUID redirect route (only in production, before catch-all)
// if (isProd) {
//   const { Post } = require('./models');

//   const isUUID = (str) => {
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//     return uuidRegex.test(str);
//   };

//   app.get('/post/:identifier', async (req, res, next) => {
//     const identifier = req.params.identifier;

//     if (!isUUID(identifier)) {
//       return next();
//     }

//     try {
//       const post = await Post.findOne({
//         where: { id: identifier },
//         attributes: ['slug']
//       });

//       if (!post) {
//         return next();
//       }

//       return res.redirect(301, `/post/${post.slug}`);
//     } catch (error) {
//       console.error('Error in UUID redirect:', error);
//       return next();
//     }
//   });
// }

// // Catch-all route for SPA
// app.get('*', (req, res) => {
//   if (isProd) {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   } else {
//     res.status(404).json({ error: 'Not Found' });
//   }
// });

// // Start server
// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`Health check available at: http://localhost:${PORT}/health`);
//     if (isProd) {
//       console.log(`Frontend served from: ${path.join(__dirname, '../client/dist')}`);
//     }
//   });
// });

const express = require('express');
const session = require('express-session');
const { RedisStore } = require('connect-redis'); // Add this
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const routes = require('./routes');
const healthRoutes = require('./routes/healthRoutes');
const sequelize = require('./config/connection');
// Remove: const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { apiLimiter, readLimiter } = require('./middleware/rateLimiter');
const { sessionSecurity, checkInactivity } = require('./middleware/sessionSecurity');
const { checkBannedIP, botHoneypot } = require('./middleware/botHoneypot');
const helmet = require('helmet');

// Add Redis client import
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Trust proxy
if (isProd) {
  app.set('trust proxy', 1);
}

// CORS configuration
const corsOptions = {
  origin: isProd ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Security headers
if (isProd) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
} else {
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
}

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes before session middleware
app.use('/', healthRoutes);

// Create Redis client for sessions
const getRedisUrl = () => {
  if (process.env.REDIS_URL && process.env.REDIS_PASSWORD) {
    const [host, port] = process.env.REDIS_URL.split(':');
    return `redis://:${process.env.REDIS_PASSWORD}@${host}:${port}`;
  }
  return process.env.REDIS_URL || 'redis://localhost:6379';
};

const redisClient = createClient({
  url: getRedisUrl(),
  legacyMode: false
});

redisClient.on('error', (err) => console.log('Redis Session Client Error:', err));
redisClient.on('connect', () => console.log('Redis Session Client Connected'));

// Connect Redis client
redisClient.connect().catch(console.error);

// Session configuration with Redis
const sess = {
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_development_only',
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 86400 // 24 hours in seconds
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/'
  },
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: 'sessionId',
  proxy: isProd,
  genid: () => crypto.randomBytes(32).toString('hex')
};

// Log environment info
console.log(`Server running in ${isProd ? 'production' : 'development'} mode`);
console.log('CORS origin:', corsOptions.origin);
console.log('Session settings:', {
  store: 'Redis',
  secure: sess.cookie.secure,
  sameSite: sess.cookie.sameSite,
  maxAge: sess.cookie.maxAge / 1000 / 60 / 60 + ' hours'
});

// Set up session middleware
app.use(session(sess));

// Session security middleware
app.use(sessionSecurity);
app.use(checkInactivity);


// Apply general rate limiters to ALL routes
app.use(apiLimiter);
app.use(readLimiter);

// DEVELOPMENT ONLY: Route to unban yourself
if (!isProd) {
  app.post('/api/dev/unban-me', async (req, res) => {
    const { createClient } = require('redis');
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    try {
      await client.connect();
      await client.del(`badbot:${req.ip}`);
      await client.del(`bot_attempts:${req.ip}`);
      await client.quit();
      res.json({ message: 'You are unbanned!', ip: req.ip });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Check if IP is banned before processing any routes
app.use(checkBannedIP);

// Middleware to set headers for favicon
app.use((req, res, next) => {
  if (req.path === '/favicon.svg') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  next();
});

// Serve static files in production
if (isProd) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Main routes - no CSRF middleware needed!
app.use(routes);

// Catch non-existent API routes (honeypot)
app.use(botHoneypot);

// UUID redirect route (only in production, before catch-all)
if (isProd) {
  const { Post } = require('./models');

  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  app.get('/post/:identifier', async (req, res, next) => {
    const identifier = req.params.identifier;

    if (!isUUID(identifier)) {
      return next();
    }

    try {
      const post = await Post.findOne({
        where: { id: identifier },
        attributes: ['slug']
      });

      if (!post) {
        return next();
      }

      return res.redirect(301, `/post/${post.slug}`);
    } catch (error) {
      console.error('Error in UUID redirect:', error);
      return next();
    }
  });
}

// Catch-all route for SPA
app.get('*', (req, res) => {
  if (isProd) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

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