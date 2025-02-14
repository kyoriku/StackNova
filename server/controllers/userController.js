// controllers/userController.js
const { User } = require('../models');

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

  // Check if user is logged in
  async getMe(req, res) {
    try {
      if (!req.session.user_id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await User.findByPk(req.session.user_id, {
        attributes: ['id', 'username', 'email']
      });

      if (!userData) {
        req.session.destroy();
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({ user: userData.get({ plain: true }) });
    } catch (err) {
      console.error('Get me error:', err);
      res.status(500).json({ error: 'Failed to retrieve user session' });
    }
  }
};

module.exports = userController;