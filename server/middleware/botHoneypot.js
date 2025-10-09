const redisService = require('../config/redis');

// Paths that are NEVER legitimate - immediate long ban
const obviousBotPaths = [
  '/.git',
  '/.env',
  '/.aws',
  '/.ssh',
  '/wp-admin',
  '/wp-login',
  '/wp-includes',
  '/wp-content',
  '/wordpress',
  '/xmlrpc.php',
  '/phpMyAdmin',
  '/phpmyadmin',
  '/admin/config',
  '/backup',
  '/.config',
  '/web.config',
  '/composer.json',
  '/package.json',
  '/.htaccess',
  '/server.js',
  '/app.js'
];

// File extensions that indicate bot scanning
const suspiciousExtensions = ['.php', '.asp', '.aspx', '.jsp', '.xml'];

// Check if IP is currently banned
const isBanned = async (ip) => {
  if (!redisService.isConnected()) return false;
  
  try {
    const banned = await redisService.get(`badbot:${ip}`);
    return banned !== null;
  } catch (error) {
    console.error('Error checking ban status:', error);
    return false;
  }
};

// Get escalating ban duration based on number of violations
const getBanDuration = (attemptCount) => {
  if (attemptCount >= 10) return 2592000;  // 30 days
  if (attemptCount >= 7) return 604800;    // 7 days  
  if (attemptCount >= 5) return 86400;     // 1 day
  if (attemptCount >= 3) return 3600;      // 1 hour
  return 0;                                // No ban until 3+ violations
};

// Track suspicious activity
const trackSuspiciousActivity = async (ip, path, severity = 'low') => {
  if (!redisService.isConnected()) return;
  
  try {
    const key = `bot_attempts:${ip}`;
    const currentAttempts = await redisService.get(key) || 0;
    const newAttempts = currentAttempts + (severity === 'high' ? 3 : 1);
    
    // Apply ban based on attempt count
    const banDuration = getBanDuration(newAttempts);
    
    // Counter TTL = ban duration + 7 day buffer (minimum 7 days)
    // This ensures violations persist longer than the ban, enabling escalation
    const counterTTL = Math.max(604800, banDuration + 604800);
    
    // Store attempt count with extended TTL
    await redisService.set(key, newAttempts, counterTTL);
    
    // Log the activity
    console.log(`\x1b[31m[SUSPICIOUS ACTIVITY]\x1b[0m ${ip} → ${path} (Attempt ${newAttempts}, Severity: ${severity})`);
    
    if (banDuration > 0) {
      await redisService.set(`badbot:${ip}`, true, banDuration);
      const banHours = Math.round(banDuration / 3600);
      console.log(`\x1b[31m[IP BANNED]\x1b[0m ${ip} banned for ${banHours} hours (${newAttempts} violations)`);
      
      // Production monitoring - track ban metrics
      if (process.env.NODE_ENV === 'production') {
        console.log(`\x1b[34m[BAN METRICS]\x1b[0m IP: ${ip}, Path: ${path}, Attempts: ${newAttempts}, Ban: ${banHours}h, Severity: ${severity}`);
        // Future: Add Sentry, LogRocket, or analytics service here
      }
    }
    
  } catch (error) {
    console.error('Error tracking suspicious activity:', error);
  }
};

// Middleware to check for banned IPs
const checkBannedIP = async (req, res, next) => {
  const banned = await isBanned(req.ip);
  
  if (banned) {
    console.log(`\x1b[31m[BLOCKED]\x1b[0m Banned IP: ${req.ip} → ${req.path}`);
    return res.status(403).json({ 
      error: 'Access forbidden',
      message: 'Your IP has been temporarily blocked due to suspicious activity'
    });
  }
  
  next();
};

// Honeypot middleware for detecting bots
const botHoneypot = async (req, res, next) => {
  // Check for obvious bot/attacker paths (NEVER legitimate)
  const isObviousBot = obviousBotPaths.some(path => 
    req.path.toLowerCase().startsWith(path.toLowerCase())
  );
  
  // Check for suspicious file extensions (PHP, ASP, JSP, XML on a React/Node app)
  const hasSuspiciousExtension = suspiciousExtensions.some(ext =>
    req.path.toLowerCase().endsWith(ext)
  );
  
  if (isObviousBot || hasSuspiciousExtension) {
    await trackSuspiciousActivity(req.ip, req.path, 'high');
    return res.status(404).json({ error: 'Not Found' });
  }
  
  // For non-existent API routes, track but be more lenient
  // This catches routes like /api/postz or /api/invalid-endpoint
  if (req.path.startsWith('/api/')) {
    // We'll let Express handle the 404 naturally through routes
    // But if they hit this middleware, the route doesn't exist
    // Track it as low severity (could be a typo)
    await trackSuspiciousActivity(req.ip, req.path, 'low');
    return res.status(404).json({ error: 'Not Found' });
  }
  
  next();
};

module.exports = {
  checkBannedIP,
  botHoneypot,
  isBanned
};