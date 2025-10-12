const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.status(401).json({ message: 'Please log in first' });
  } else {
    // Track last activity for inactivity timeout
    req.session.lastActivity = Date.now();
    next();
  }
};

module.exports = withAuth;