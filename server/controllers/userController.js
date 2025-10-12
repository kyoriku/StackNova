// const { User, Post, Comment } = require('../models');
// const redisService = require('../config/redis');
// const sequelize = require('../config/connection');

// // Common user profile query options
// const userProfileQueryOptions = {
//   attributes: ['username', 'createdAt'],
//   include: [
//     {
//       model: Post,
//       attributes: ['id', 'title', 'content', 'excerpt', 'slug', 'createdAt', 'updatedAt'],
//       include: [
//         {
//           model: User,
//           attributes: ['username']
//         },
//         {
//           model: Comment,
//           attributes: ['id', 'comment_text', 'excerpt', 'createdAt', 'updatedAt'],
//           include: [{
//             model: User,
//             attributes: ['username']
//           }]
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     },
//     {
//       model: Comment,
//       attributes: ['id', 'comment_text', 'excerpt', 'createdAt', 'updatedAt'],
//       include: [{
//         model: Post,
//         attributes: ['id', 'title', 'slug']
//       }],
//       order: [['createdAt', 'DESC']]
//     }
//   ]
// };

// // Helper function for OAuth - improved username generation
// const generateUniqueUsername = async (email, displayName) => {
//   let candidates = [];

//   if (displayName) {
//     const displayNameClean = displayName.toLowerCase()
//       .replace(/[^a-zA-Z0-9\s]/g, '')
//       .replace(/\s+/g, '');
//     if (displayNameClean.length >= 3) {
//       candidates.push(displayNameClean);
//     }
//   }

//   const emailPrefix = email.split('@')[0]
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9]/g, '');
//   if (emailPrefix.length >= 3) {
//     candidates.push(emailPrefix);
//   }

//   candidates.push('user');

//   for (let baseUsername of candidates) {
//     let username = baseUsername;
//     let counter = 1;

//     if (!(await User.findOne({ where: { username } }))) {
//       return username;
//     }

//     while (counter <= 999) {
//       username = `${baseUsername}${counter}`;
//       if (!(await User.findOne({ where: { username } }))) {
//         return username;
//       }
//       counter++;
//     }
//   }

//   return `user${Date.now()}`;
// };

// const userController = {
//   // Create new user with session regeneration
//   async createUser(req, res) {
//     try {
//       const userData = await User.create(req.body);

//       await redisService.clearUserProfileCache(userData.username);

//       // SECURITY: Regenerate session after user creation
//       req.session.regenerate((err) => {
//         if (err) {
//           console.error('Session regeneration error:', err);
//           return res.status(500).json({ message: 'Account created but login failed' });
//         }

//         req.session.user_id = userData.id;
//         req.session.logged_in = true;
//         req.session.userAgent = req.headers['user-agent'];
//         req.session.lastActivity = Date.now();

//         req.session.save((err) => {
//           if (err) {
//             console.error('Session save error:', err);
//             return res.status(500).json({ message: 'Account created but login failed' });
//           }

//           res.status(201).json({
//             user: userData.get({ plain: true }),
//             message: 'User created successfully'
//           });
//         });
//       });
//     } catch (err) {
//       console.error('Error creating user:', err);
//       if (err.name === 'SequelizeUniqueConstraintError') {
//         res.status(400).json({
//           message: 'Email or username already exists',
//           error: err.message
//         });
//       } else {
//         res.status(400).json({
//           message: 'Failed to create user',
//           error: err.message
//         });
//       }
//     }
//   },

//   // User login with session regeneration
//   async login(req, res) {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({
//           message: 'Email and password are required'
//         });
//       }

//       const userData = await User.findOne({
//         where: { email }
//       });

//       if (!userData || !(await userData.checkPassword(password))) {
//         return res.status(400).json({
//           message: 'Incorrect email or password'
//         });
//       }

//       // SECURITY: Regenerate session ID to prevent session fixation
//       req.session.regenerate((err) => {
//         if (err) {
//           console.error('Session regeneration error:', err);
//           return res.status(500).json({ message: 'Login failed' });
//         }

//         // Set session data
//         req.session.user_id = userData.id;
//         req.session.logged_in = true;
//         req.session.userAgent = req.headers['user-agent'];
//         req.session.lastActivity = Date.now();

//         req.session.save((err) => {
//           if (err) {
//             console.error('Session save error:', err);
//             return res.status(500).json({ message: 'Login failed' });
//           }

//           res.json({
//             user: userData.get({ plain: true }),
//             message: 'Logged in successfully'
//           });
//         });
//       });
//     } catch (err) {
//       console.error('Error logging in:', err);
//       res.status(500).json({
//         message: 'Login failed',
//         error: err.message
//       });
//     }
//   },

//   // User logout (now with CSRF protection)
//   async logout(req, res) {
//     try {
//       if (!req.session.logged_in) {
//         return res.status(400).json({
//           message: 'Not logged in'
//         });
//       }

//       await new Promise((resolve, reject) => {
//         req.session.destroy((err) => {
//           if (err) reject(err);
//           resolve();
//         });
//       });

//       res.clearCookie('sessionId', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         path: '/',
//       });

//       res.status(204).end();
//     } catch (err) {
//       console.error('Error logging out:', err);
//       res.status(500).json({
//         message: 'Logout failed',
//         error: err.message
//       });
//     }
//   },

//   // Logout from all devices (NEW)
//   async logoutAllDevices(req, res) {
//     try {
//       const userId = req.session.user_id;

//       if (!userId) {
//         return res.status(401).json({ message: 'Not logged in' });
//       }

//       // Destroy all sessions for this user from the database
//       await sequelize.query(
//         `DELETE FROM sessions WHERE sess::text LIKE '%"user_id":"${userId}"%'`,
//         { type: sequelize.QueryTypes.DELETE }
//       );

//       res.json({ message: 'Logged out from all devices successfully' });
//     } catch (err) {
//       console.error('Error logging out all devices:', err);
//       res.status(500).json({ 
//         message: 'Failed to logout from all devices',
//         error: err.message 
//       });
//     }
//   },

//   // Check session status
//   async checkSession(req, res) {
//     try {
//       if (!req.session.user_id) {
//         return res.status(204).end();
//       }

//       const userData = await User.findByPk(req.session.user_id, {
//         attributes: ['id', 'username', 'email']
//       });

//       if (!userData) {
//         req.session.destroy();
//         return res.status(204).end();
//       }

//       // Update last activity
//       req.session.lastActivity = Date.now();

//       res.status(200).json({
//         user: userData.get({ plain: true })
//       });
//     } catch (err) {
//       console.error('Error checking session:', err);
//       res.status(204).end();
//     }
//   },

//   // Get user profile
//   async getUserProfile(req, res) {
//     try {
//       const username = req.params.username;

//       if (!username) {
//         return res.status(400).json({
//           message: 'Username is required'
//         });
//       }

//       const userData = await User.findOne({
//         where: { username },
//         ...userProfileQueryOptions
//       });

//       if (!userData) {
//         return res.status(404).json({
//           message: 'No user found with this username!'
//         });
//       }

//       res.json(userData.get({ plain: true }));
//     } catch (err) {
//       console.error('Error fetching user profile:', err);
//       res.status(500).json({
//         message: 'Failed to get user profile',
//         error: err.message
//       });
//     }
//   },

//   // Handle Google OAuth callback
//   async googleCallback(req, res) {
//     try {
//       const { id, emails, photos, displayName } = req.user;
//       const email = emails[0].value;

//       // Extract return path from state parameter
//       let returnPath = '/dashboard';
//       try {
//         const state = req.query.state || req.session.oauth_state;
//         if (state) {
//           const decodedState = JSON.parse(atob(state));
//           returnPath = decodedState.returnPath || '/dashboard';

//           const maxAge = 10 * 60 * 1000;
//           if (decodedState.timestamp && (Date.now() - decodedState.timestamp > maxAge)) {
//             console.warn('OAuth state parameter expired');
//             returnPath = '/dashboard';
//           }
//         }
//         delete req.session.oauth_state;
//       } catch (err) {
//         console.warn('Failed to decode OAuth state parameter:', err.message);
//         returnPath = '/dashboard';
//       }

//       // Check if user already exists with this Google ID
//       let userData = await User.findOne({
//         where: {
//           oauth_id: id,
//           auth_provider: 'google'
//         }
//       });

//       if (!userData) {
//         const existingUser = await User.findOne({ where: { email } });

//         if (existingUser && existingUser.auth_provider === 'local') {
//           await existingUser.update({
//             oauth_id: id,
//             auth_provider: 'google',
//             avatar_url: photos[0]?.value,
//             display_name: displayName
//           });
//           userData = existingUser;
//           await redisService.clearUserProfileCache(userData.username);
//         } else if (!existingUser) {
//           const uniqueUsername = await generateUniqueUsername(email, displayName);

//           userData = await User.create({
//             username: uniqueUsername,
//             email: email,
//             auth_provider: 'google',
//             oauth_id: id,
//             avatar_url: photos[0]?.value,
//             display_name: displayName,
//             password: null
//           });

//           await redisService.clearUserProfileCache(userData.username);
//         } else {
//           throw new Error('An account with this email already exists');
//         }
//       }

//       // SECURITY: Regenerate session ID after OAuth login
//       req.session.regenerate((err) => {
//         if (err) {
//           console.error('Session regeneration error:', err);
//           return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
//         }

//         req.session.user_id = userData.id;
//         req.session.logged_in = true;
//         req.session.userAgent = req.headers['user-agent'];
//         req.session.lastActivity = Date.now();

//         req.session.save(() => {
//           res.redirect(`${process.env.FRONTEND_URL}${returnPath}`);
//         });
//       });

//     } catch (err) {
//       console.error('Google OAuth error:', err);
//       res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
//     }
//   },

//   // Handle OAuth failure
//   async oauthFailure(req, res) {
//     res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_cancelled`);
//   }
// };

// module.exports = userController;

const { User, Post, Comment } = require('../models');
const redisService = require('../config/redis');
const sequelize = require('../config/connection');

// Common user profile query options
const userProfileQueryOptions = {
  attributes: ['username', 'createdAt'],
  include: [
    {
      model: Post,
      attributes: ['id', 'title', 'content', 'excerpt', 'slug', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'excerpt', 'createdAt', 'updatedAt'],
          include: [{
            model: User,
            attributes: ['username']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    },
    {
      model: Comment,
      attributes: ['id', 'comment_text', 'excerpt', 'createdAt', 'updatedAt'],
      include: [{
        model: Post,
        attributes: ['id', 'title', 'slug']
      }],
      order: [['createdAt', 'DESC']]
    }
  ]
};

// Helper function to set session data
const setSessionData = (req, userId) => {
  req.session.user_id = userId;
  req.session.logged_in = true;
  req.session.userAgent = req.headers['user-agent'];
  req.session.ipAddress = req.ip || req.connection.remoteAddress;
  req.session.lastActivity = Date.now();
  req.session.createdAt = Date.now(); // Track when session was created
};

// Helper function for OAuth - improved username generation
const generateUniqueUsername = async (email, displayName) => {
  let candidates = [];

  if (displayName) {
    const displayNameClean = displayName.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '');
    if (displayNameClean.length >= 3) {
      candidates.push(displayNameClean);
    }
  }

  const emailPrefix = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '');
  if (emailPrefix.length >= 3) {
    candidates.push(emailPrefix);
  }

  candidates.push('user');

  for (let baseUsername of candidates) {
    let username = baseUsername;
    let counter = 1;

    if (!(await User.findOne({ where: { username } }))) {
      return username;
    }

    while (counter <= 999) {
      username = `${baseUsername}${counter}`;
      if (!(await User.findOne({ where: { username } }))) {
        return username;
      }
      counter++;
    }
  }

  return `user${Date.now()}`;
};

const userController = {
  // Create new user with session regeneration
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);

      await redisService.clearUserProfileCache(userData.username);

      // SECURITY: Regenerate session after user creation to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({
            message: 'Account created but login failed. Please try logging in.',
            error: 'SESSION_ERROR'
          });
        }

        // Set all session data
        setSessionData(req, userData.id);

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({
              message: 'Account created but login failed. Please try logging in.',
              error: 'SESSION_ERROR'
            });
          }

          res.status(201).json({
            user: userData.get({ plain: true }),
            message: 'User created successfully'
          });
        });
      });
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          message: 'Email or username already exists',
          error: err.message
        });
      } else {
        res.status(400).json({
          message: 'Failed to create user',
          error: err.message
        });
      }
    }
  },

  // User login with session regeneration and optional "Remember Me"
  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      const userData = await User.findOne({
        where: { email }
      });

      if (!userData || !(await userData.checkPassword(password))) {
        return res.status(400).json({
          message: 'Incorrect email or password'
        });
      }

      // SECURITY: Regenerate session ID to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({
            message: 'Login failed',
            error: 'SESSION_ERROR'
          });
        }

        // Set all session data
        setSessionData(req, userData.id);

        // Optional: Extend session if "Remember Me" is checked
        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
          console.log(`Extended session for user ${userData.id} (Remember Me)`);
        }

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({
              message: 'Login failed',
              error: 'SESSION_ERROR'
            });
          }

          res.json({
            user: userData.get({ plain: true }),
            message: 'Logged in successfully'
          });
        });
      });
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).json({
        message: 'Login failed',
        error: err.message
      });
    }
  },

  // User logout
  async logout(req, res) {
    try {
      if (!req.session.logged_in) {
        return res.status(400).json({
          message: 'Not logged in'
        });
      }

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({
            message: 'Logout failed',
            error: err.message
          });
        }

        // Clear the cookie
        res.clearCookie('sessionId', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });

        res.status(204).end();
      });
    } catch (err) {
      console.error('Error logging out:', err);
      res.status(500).json({
        message: 'Logout failed',
        error: err.message
      });
    }
  },

  // Logout from all devices
  async logoutAllDevices(req, res) {
    try {
      const userId = req.session.user_id;

      if (!userId) {
        return res.status(401).json({
          message: 'Not logged in',
          error: 'UNAUTHORIZED'
        });
      }

      // Import Redis client (or create a new connection)
      const { createClient } = require('redis');
      const redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      await redisClient.connect();

      // Find all session keys for this user
      const sessionKeys = await redisClient.keys('sess:*');

      // Check each session for this user_id and delete it
      for (const key of sessionKeys) {
        const sessionData = await redisClient.get(key);
        if (sessionData && sessionData.includes(`"user_id":${userId}`)) {
          await redisClient.del(key);
        }
      }

      await redisClient.quit();

      // Clear current session cookie
      res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.json({
        message: 'Logged out from all devices successfully'
      });
    } catch (err) {
      console.error('Error logging out all devices:', err);
      res.status(500).json({
        message: 'Failed to logout from all devices',
        error: err.message
      });
    }
  },

  // Check session status
  async checkSession(req, res) {
    try {
      if (!req.session.user_id) {
        return res.status(204).end();
      }

      const userData = await User.findByPk(req.session.user_id, {
        attributes: ['id', 'username', 'email']
      });

      if (!userData) {
        // User was deleted - destroy session
        req.session.destroy();
        return res.status(204).end();
      }

      // Update last activity (already done by checkInactivity middleware, but belt-and-suspenders)
      req.session.lastActivity = Date.now();

      res.status(200).json({
        user: userData.get({ plain: true })
      });
    } catch (err) {
      console.error('Error checking session:', err);
      res.status(204).end();
    }
  },

  // Get user profile
  async getUserProfile(req, res) {
    try {
      const username = req.params.username;

      if (!username) {
        return res.status(400).json({
          message: 'Username is required'
        });
      }

      const userData = await User.findOne({
        where: { username },
        ...userProfileQueryOptions
      });

      if (!userData) {
        return res.status(404).json({
          message: 'No user found with this username!'
        });
      }

      res.json(userData.get({ plain: true }));
    } catch (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({
        message: 'Failed to get user profile',
        error: err.message
      });
    }
  },

  // Handle Google OAuth callback
  async googleCallback(req, res) {
    try {
      const { id, emails, photos, displayName } = req.user;
      const email = emails[0].value;

      // Extract return path from state parameter
      let returnPath = '/dashboard';
      try {
        const state = req.query.state || req.session.oauth_state;
        if (state) {
          const decodedState = JSON.parse(atob(state));
          returnPath = decodedState.returnPath || '/dashboard';

          const maxAge = 10 * 60 * 1000;
          if (decodedState.timestamp && (Date.now() - decodedState.timestamp > maxAge)) {
            console.warn('OAuth state parameter expired');
            returnPath = '/dashboard';
          }
        }
        delete req.session.oauth_state;
      } catch (err) {
        console.warn('Failed to decode OAuth state parameter:', err.message);
        returnPath = '/dashboard';
      }

      // Check if user already exists with this Google ID
      let userData = await User.findOne({
        where: {
          oauth_id: id,
          auth_provider: 'google'
        }
      });

      if (!userData) {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser && existingUser.auth_provider === 'local') {
          await existingUser.update({
            oauth_id: id,
            auth_provider: 'google',
            avatar_url: photos[0]?.value,
            display_name: displayName
          });
          userData = existingUser;
          await redisService.clearUserProfileCache(userData.username);
        } else if (!existingUser) {
          const uniqueUsername = await generateUniqueUsername(email, displayName);

          userData = await User.create({
            username: uniqueUsername,
            email: email,
            auth_provider: 'google',
            oauth_id: id,
            avatar_url: photos[0]?.value,
            display_name: displayName,
            password: null
          });

          await redisService.clearUserProfileCache(userData.username);
        } else {
          throw new Error('An account with this email already exists');
        }
      }

      // SECURITY: Regenerate session ID after OAuth login
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
        }

        // Set all session data
        setSessionData(req, userData.id);

        req.session.save(() => {
          res.redirect(`${process.env.FRONTEND_URL}${returnPath}`);
        });
      });

    } catch (err) {
      console.error('Google OAuth error:', err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  },

  // Handle OAuth failure
  async oauthFailure(req, res) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_cancelled`);
  }
};

module.exports = userController;