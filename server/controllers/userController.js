// controllers/userController.js
const { User, Post, Comment } = require('../models');

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
      console.error('Create user error:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          error: 'Email or username already exists'
        });
      } else {
        res.status(400).json({
          error: 'Unable to create user'
        });
      }
    }
  },

  // User login
  async login(req, res) {
    try {
      const userData = await User.findOne({
        where: { email: req.body.email }
      });

      if (!userData || !(await userData.checkPassword(req.body.password))) {
        res.status(400).json({
          error: 'Incorrect email or password'
        });
        return;
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
      console.error('Login error:', err);
      res.status(500).json({
        error: 'Login failed'
      });
    }
  },

  // User logout
  async logout(req, res) {
    try {
      if (req.session.logged_in) {
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
      } else {
        res.status(400).json({
          error: 'Not logged in'
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({
        error: 'Logout failed'
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
      console.error('Session check error:', err);
      // Return 204 for any errors instead of 500
      res.status(204).end();
    }
  },

  async getUserProfile(req, res) {
    try {
      const userData = await User.findOne({
        where: { username: req.params.username },
        attributes: ['username', 'createdAt'], // Only necessary fields
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'content', 'excerpt', 'createdAt', 'updatedAt'], // Exclude user_id
            include: [
              {
                model: User,
                attributes: ['username'] // Only show username, no ID
              },
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'createdAt', 'updatedAt'], // Exclude user_id
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
            attributes: ['id', 'comment_text', 'createdAt', 'updatedAt'], // Exclude user_id
            include: [{
              model: Post,
              attributes: ['id', 'title']
            }],
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!userData) {
        res.status(404).json({ message: 'No user found with this username!' });
        return;
      }

      res.json(userData.get({ plain: true }));
    } catch (err) {
      console.error('Get user profile error:', err);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }

};

module.exports = userController;