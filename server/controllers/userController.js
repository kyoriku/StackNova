// controllers/userController.js
const { User, Post, Comment } = require('../models');

// Common user profile query options
const userProfileQueryOptions = {
  attributes: ['username', 'createdAt'],
  include: [
    {
      model: Post,
      attributes: ['id', 'title', 'content', 'excerpt', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'createdAt', 'updatedAt'],
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
      attributes: ['id', 'comment_text', 'createdAt', 'updatedAt'],
      include: [{
        model: Post,
        attributes: ['id', 'title']
      }],
      order: [['createdAt', 'DESC']]
    }
  ]
};

const userController = {
  // Create new user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);

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
  }
};

module.exports = userController;