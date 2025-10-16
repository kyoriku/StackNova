const { AppError } = require('./errorHandler');
const ERROR_CODES = require('../constants/errorCodes');

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes
// const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes for testing

// Extract browser family from user agent
const extractBrowserFamily = (ua) => {
  if (!ua) return 'unknown';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return ua.split('/')[0] || 'unknown';
};

// Relaxed session security - checks for major changes only
const sessionSecurity = (req, res, next) => {
  // Skip if not logged in
  if (!req.session.logged_in) {
    return next();
  }

  const currentUserAgent = req.headers['user-agent'];
  const currentIP = req.ip || req.connection.remoteAddress;

  // First request after login - store metadata
  if (!req.session.userAgent || !req.session.ipAddress) {
    req.session.userAgent = currentUserAgent;
    req.session.ipAddress = currentIP;
    req.session.lastActivity = Date.now();
    return next();
  }

  // Check for major browser changes (not minor version updates)
  const sessionBrowser = extractBrowserFamily(req.session.userAgent);
  const currentBrowser = extractBrowserFamily(currentUserAgent);

  // Only flag if browser family completely changes
  if (sessionBrowser !== currentBrowser) {
    console.warn(`Security: Browser changed from ${sessionBrowser} to ${currentBrowser} for user ${req.session.user_id}`);

    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
    });

    return next(new AppError(
      'Session security check failed. Please log in again.',
      401,
      ERROR_CODES.SESSION_SECURITY_VIOLATION
    ));
  }

  next();
};

// Check for session inactivity timeout
const checkInactivity = (req, res, next) => {
  if (req.session.logged_in) {
    // Skip inactivity check if remember me is active
    if (req.session.rememberMe) {
      // Still update last activity for record keeping
      req.session.lastActivity = Date.now();
      return next();
    }

    const now = Date.now();

    // Check if session expired due to inactivity (only for non-remember-me sessions)
    if (req.session.lastActivity) {
      const inactiveTime = now - req.session.lastActivity;

      if (inactiveTime > INACTIVITY_TIMEOUT) {
        console.log(`Session expired due to inactivity for user ${req.session.user_id}`);

        req.session.destroy((err) => {
          if (err) console.error('Session destroy error:', err);
        });

        return next(new AppError(
          'Session expired due to inactivity. Please log in again.',
          401,
          ERROR_CODES.SESSION_TIMEOUT
        ));
      }
    }

    // Update last activity timestamp on every request
    req.session.lastActivity = now;
  }

  next();
};

module.exports = {
  sessionSecurity,
  checkInactivity,
  INACTIVITY_TIMEOUT
};