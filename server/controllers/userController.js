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

        res.status(201).json(userData);
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // User login
  async login(req, res) {
    try {
      const userData = await User.findOne({
        where: { email: req.body.email }
      });

      if (!userData) {
        res.status(400).json({
          message: 'Incorrect email or password'
        });
        return;
      }

      const validPassword = await userData.checkPassword(req.body.password);

      if (!validPassword) {
        res.status(400).json({
          message: 'Incorrect email or password'
        });
        return;
      }

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.json({
          user: userData,
          message: 'Logged in successfully'
        });
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // User logout
  async logout(req, res) {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  }
};

module.exports = userController;