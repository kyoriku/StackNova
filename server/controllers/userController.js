const { User, Post, Comment } = require('../models');
const redisService = require('../config/redis'); // Add this import

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

// Helper function for OAuth - improved username generation
const generateUniqueUsername = async (email, displayName) => {
  // Try different username strategies in order of preference
  let candidates = [];

  // Strategy 1: Use display name if available (e.g., "John Doe" -> "johndoe")
  if (displayName) {
    const displayNameClean = displayName.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '');
    if (displayNameClean.length >= 3) {
      candidates.push(displayNameClean);
    }
  }

  // Strategy 2: Use email prefix (e.g., "john.doe@gmail.com" -> "johndoe")
  const emailPrefix = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '');
  if (emailPrefix.length >= 3) {
    candidates.push(emailPrefix);
  }

  // Strategy 3: Fallback to "user" + random number
  candidates.push('user');

  // Try each candidate
  for (let baseUsername of candidates) {
    let username = baseUsername;
    let counter = 1;

    // Check if base username is available
    if (!(await User.findOne({ where: { username } }))) {
      return username;
    }

    // Try with numbers appended
    while (counter <= 999) {
      username = `${baseUsername}${counter}`;
      if (!(await User.findOne({ where: { username } }))) {
        return username;
      }
      counter++;
    }
  }

  // Ultimate fallback
  return `user${Date.now()}`;
};

const userController = {
  // Create new user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);

      // Clear user profile cache for the new user
      await redisService.clearUserProfileCache(userData.username);

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.status(201).json({
          user: userData.get({ plain: true }),
          message: 'User created successfully'
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

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

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

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.json({
          user: userData.get({ plain: true }),
          message: 'Logged in successfully'
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

      // Clear the session from database
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve();
        });
      });

      // Clear the cookie
      res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
      });

      res.status(204).end();
    } catch (err) {
      console.error('Error logging out:', err);
      res.status(500).json({
        message: 'Logout failed',
        error: err.message
      });
    }
  },

  // Check session status for the current user (if any)
  async checkSession(req, res) {
    try {
      if (!req.session.user_id) {
        // Return 204 No Content instead of 401
        return res.status(204).end();
      }

      const userData = await User.findByPk(req.session.user_id, {
        attributes: ['id', 'username', 'email']
      });

      if (!userData) {
        // User not found, clear session and return 204
        req.session.destroy();
        return res.status(204).end();
      }

      // Only return JSON if there's an active session
      res.status(200).json({
        user: userData.get({ plain: true })
      });
    } catch (err) {
      console.error('Error checking session:', err);
      // Return 204 for any errors instead of 500
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
      let returnPath = '/dashboard'; // default
      try {
        const state = req.query.state || req.session.oauth_state;
        if (state) {
          const decodedState = JSON.parse(atob(state));
          returnPath = decodedState.returnPath || '/dashboard';

          // Optional: Validate timestamp for security (reject old requests)
          const maxAge = 10 * 60 * 1000; // 10 minutes
          if (decodedState.timestamp && (Date.now() - decodedState.timestamp > maxAge)) {
            console.warn('OAuth state parameter expired');
            returnPath = '/dashboard';
          }
        }
        // Clean up session
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
        // Check if user exists with same email but different auth provider
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser && existingUser.auth_provider === 'local') {
          // Link Google account to existing local user
          await existingUser.update({
            oauth_id: id,
            auth_provider: 'google',
            avatar_url: photos[0]?.value,
            display_name: displayName
          });
          userData = existingUser;

          // Clear user profile cache after updating existing user
          await redisService.clearUserProfileCache(userData.username);
        } else if (!existingUser) {
          // Create new user
          const uniqueUsername = await generateUniqueUsername(email, displayName);

          userData = await User.create({
            username: uniqueUsername,
            email: email,
            auth_provider: 'google',
            oauth_id: id,
            avatar_url: photos[0]?.value,
            display_name: displayName,
            password: null // No password for OAuth users
          });

          // Clear user profile cache for new user
          await redisService.clearUserProfileCache(userData.username);
        } else {
          // User exists with same email but different provider - handle conflict
          throw new Error('An account with this email already exists');
        }
      }

      // Create session
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        // Redirect to the original return path
        res.redirect(`${process.env.FRONTEND_URL}${returnPath}`);
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