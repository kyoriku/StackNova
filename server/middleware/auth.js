const { AppError } = require('./errorHandler');
const ERROR_CODES = require('../constants/errorCodes');

const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    return next(new AppError(
      'Please log in first',
      401,
      ERROR_CODES.UNAUTHORIZED
    ));
  }
  
  // Track last activity for inactivity timeout
  req.session.lastActivity = Date.now();
  next();
};

module.exports = withAuth;