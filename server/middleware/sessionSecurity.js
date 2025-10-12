// const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
// // const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes for testing

// // Validate session hasn't been hijacked
// const sessionSecurity = (req, res, next) => {
//   // Skip if not logged in
//   if (!req.session.logged_in) {
//     return next();
//   }

//   const currentUserAgent = req.headers['user-agent'];

//   // First request after login - store metadata
//   if (!req.session.userAgent) {
//     req.session.userAgent = currentUserAgent;
//     return next();
//   }

//   // Validate user agent hasn't changed (prevents session hijacking)
//   if (req.session.userAgent !== currentUserAgent) {
//     console.warn(`Security: User agent changed for user ${req.session.user_id}`);

//     req.session.destroy();

//     return res.status(401).json({ 
//       message: 'Session invalid. Please log in again.',
//       code: 'SESSION_SECURITY_VIOLATION'
//     });
//   }

//   next();
// };

// // Check for session inactivity timeout
// const checkInactivity = (req, res, next) => {
//   if (req.session.logged_in && req.session.lastActivity) {
//     const inactiveTime = Date.now() - req.session.lastActivity;

//     if (inactiveTime > INACTIVITY_TIMEOUT) {
//       console.log(`Session expired due to inactivity for user ${req.session.user_id}`);

//       req.session.destroy();

//       return res.status(401).json({ 
//         message: 'Session expired due to inactivity. Please log in again.',
//         code: 'SESSION_TIMEOUT'
//       });
//     }
//   }

//   next();
// };

// module.exports = { sessionSecurity, checkInactivity };

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
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

    return res.status(401).json({
      message: 'Session security check failed. Please log in again.',
      code: 'SESSION_SECURITY_VIOLATION'
    });
  }

  next();
};

// Check for session inactivity timeout
const checkInactivity = (req, res, next) => {
  if (req.session.logged_in) {
    const now = Date.now();

    // Check if session expired due to inactivity
    if (req.session.lastActivity) {
      const inactiveTime = now - req.session.lastActivity;

      if (inactiveTime > INACTIVITY_TIMEOUT) {
        console.log(`Session expired due to inactivity for user ${req.session.user_id}`);

        req.session.destroy((err) => {
          if (err) console.error('Session destroy error:', err);
        });

        return res.status(401).json({
          message: 'Session expired due to inactivity. Please log in again.',
          code: 'SESSION_TIMEOUT'
        });
      }
    }

    // CRITICAL: Update last activity timestamp on every request
    req.session.lastActivity = now;
  }

  next();
};

module.exports = {
  sessionSecurity,
  checkInactivity,
  INACTIVITY_TIMEOUT
};