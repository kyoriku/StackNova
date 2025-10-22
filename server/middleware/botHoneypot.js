const redisService = require('../config/redisCache');

// Paths that are NEVER legitimate - immediate long ban
// Note: Uses startsWith() so prefixes catch all variants
const obviousBotPaths = [
  // Version control & environment
  '/.git',              // Catches /.git/config, /.git/HEAD, etc.
  '/.env',              // Catches /.env, /.env.local, /.env.production, etc.
  '/.aws',              // Catches /.aws/credentials, /.aws/config, etc.
  '/.ssh',
  '/.config',
  '/.htaccess',
  '/.DS_Store',
  // WordPress
  '/wp-admin',
  '/wp-login',
  '/wp-includes',
  '/wp-content',
  '/wordpress',
  '/xmlrpc.php',
  // Database management
  '/phpMyAdmin',
  '/phpmyadmin',
  // Admin panels & config
  '/admin',             // Catches /admin/config, /administrator, /admin.php, etc.
  // Cloud metadata (AWS, GCP, Azure)
  '/latest',            // AWS metadata (catches /latest/meta-data, /latest/api/token, etc.)
  '/metadata',          // GCP/Azure metadata (catches all /metadata/* paths)
  '/computeMetadata',   // GCP compute metadata
  // Backup files
  '/backup',            // Catches /backup.sql, /backup, etc.
  '/database',          // Catches /database.sql, etc.
  '/dump',              // Catches /dump.sql, etc.
  // Config files
  '/config',            // Catches /config.json, /config.php, /web.config, etc.
  '/composer.json',
  '/package.json',
  // Common app entry points (exposed source)
  '/server.js',
  '/app.js',
  // Monorepo paths
  '/apps/.env',
  '/services/.env',
  '/packages/.env',
  // Framework-specific
  '/laravel',
  // Common backdoors & shells
  '/shell',
  '/c99',
  '/r57',
  '/phpinfo',
  // CI/CD & deployment configs
  '/.github',           // GitHub Actions, workflows
  '/.gitlab-ci',        // GitLab CI
  '/azure-pipelines',   // Azure Pipelines
  '/netlify.toml',
  '/vercel.json',
  // Infrastructure as Code
  '/terraform',         // Terraform configs
  '/.terraform',        // Terraform state
  '/.kube',             // Kubernetes configs
  '/kubernetes',        // Kubernetes manifests
  // Docker
  '/docker-compose',    // Docker Compose files
  '/Dockerfile',
  // Source maps (leak source code)
  '/app.js.map',
  '/bundle.js.map',
  '/main.js.map',
  '/vendor.js.map'
];

// File extensions that indicate bot scanning
const suspiciousExtensions = [
  '.php',
  '.asp', 
  '.aspx', 
  '.jsp',
  '.xml',
  '.yaml',        // Kubernetes, Docker Compose configs
  '.yml',         // CI/CD configs (GitHub Actions, GitLab)
  '.map',         // Source maps (leak entire source code)
  '.toml',        // Config files (Netlify, Cargo, Poetry)
  '.tfvars',      // Terraform variables (infrastructure secrets)
  '.tfstate'      // Terraform state (infrastructure details)
];

// Extract subnet from IP (first 3 octets)
const getSubnet = (ip) => {
  const parts = ip.split('.');
  if (parts.length !== 4) return ip; // Invalid IP, return as-is
  return `${parts[0]}.${parts[1]}.${parts[2]}`;
};

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
const getBanDuration = (attemptCount, isHighSeverity = false) => {
  // High severity paths (/.env, /wp-admin, etc) = immediate 7-day ban
  if (isHighSeverity && attemptCount >= 1) return 604800;  // 7 days immediately
  
  // Progressive escalation for lower severity
  if (attemptCount >= 10) return 2592000;  // 30 days
  if (attemptCount >= 7) return 604800;    // 7 days  
  if (attemptCount >= 4) return 86400;     // 1 day (lowered from 5)
  if (attemptCount >= 2) return 3600;      // 1 hour (lowered from 3)
  return 0;                                // No ban until 2+ violations
};

// Track suspicious activity with subnet awareness
const trackSuspiciousActivity = async (ip, path, severity = 'low') => {
  if (!redisService.isConnected()) return;
  
  try {
    // Track individual IP violations
    const key = `bot_attempts:${ip}`;
    const currentAttempts = await redisService.get(key) || 0;
    const isFirstOffense = currentAttempts === 0;
    const multiplier = severity === 'high' ? 3 : 1;
    const newAttempts = currentAttempts + multiplier;
    
    // Track subnet violations to detect IP rotation
    const subnet = getSubnet(ip);
    const subnetKey = `bot_subnet:${subnet}`;
    const subnetAttempts = await redisService.get(subnetKey) || 0;
    const newSubnetAttempts = subnetAttempts + multiplier;
    
    // If subnet has many violations, escalate severity automatically
    // This catches bots rotating IPs within the same subnet
    if (newSubnetAttempts >= 15 && severity !== 'high') {
      severity = 'high';
      console.log(`\x1b[33m[SUBNET PATTERN DETECTED]\x1b[0m ${subnet}.x has ${newSubnetAttempts} total violations across multiple IPs`);
    }
    
    // Determine ban duration
    const isHighSeverity = severity === 'high';
    const banDuration = getBanDuration(newAttempts, isHighSeverity);
    
    // Counter TTL = ban duration + 7 day buffer (minimum 7 days)
    // This ensures violations persist longer than the ban, enabling escalation
    const counterTTL = Math.max(604800, banDuration + 604800);
    
    // Store attempt counts with extended TTL
    await redisService.set(key, newAttempts, counterTTL);
    await redisService.set(subnetKey, newSubnetAttempts, 604800); // 7 days
    
    // Log the activity with clear messaging
    const attemptDisplay = isHighSeverity && isFirstOffense 
      ? `1st offense (weighted as ${newAttempts})`
      : `${newAttempts} attempts`;
    
    console.log(`\x1b[31m[SUSPICIOUS ACTIVITY]\x1b[0m ${ip} (${subnet}.x) → ${path} (${attemptDisplay}, Subnet: ${newSubnetAttempts}, Severity: ${severity})`);
    
    if (banDuration > 0) {
      await redisService.set(`badbot:${ip}`, true, banDuration);
      const banHours = Math.round(banDuration / 3600);
      const banDays = Math.round(banDuration / 86400);
      const banDisplay = banDays >= 1 ? `${banDays} days` : `${banHours} hours`;
      
      const banReason = isHighSeverity && isFirstOffense
        ? `immediate ${severity}-severity ban`
        : `${newAttempts} violations`;
      
      console.log(`\x1b[31m[IP BANNED]\x1b[0m ${ip} banned for ${banDisplay} (${banReason})`);
      
      // Production monitoring - track ban metrics
      if (process.env.NODE_ENV === 'production') {
        console.log(`\x1b[34m[BAN METRICS]\x1b[0m IP: ${ip}, Subnet: ${subnet}.x, Path: ${path}, Weighted: ${newAttempts}, Ban: ${banDisplay}, Severity: ${severity}, FirstOffense: ${isFirstOffense}`);
        // Future: Add Sentry, LogRocket, or analytics service here
      }
    }
    
  } catch (error) {
    console.error('Error tracking suspicious activity:', error);
  }
};

// Middleware to check for banned IPs
const checkBannedIP = async (req, res, next) => {
  // Whitelist localhost during development
  const isLocalhost = req.ip === '::1' || 
                      req.ip === '::ffff:127.0.0.1' || 
                      req.ip === '127.0.0.1';
  
  if (isLocalhost && process.env.NODE_ENV !== 'production') {
    return next();
  }
  
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
  // Whitelist dev routes and localhost
  const isLocalhost = req.ip === '::1' || 
                      req.ip === '::ffff:127.0.0.1' || 
                      req.ip === '127.0.0.1';
  
  const isDevRoute = req.path.startsWith('/api/dev/');
  
  if ((isLocalhost || isDevRoute) && process.env.NODE_ENV !== 'production') {
    return next();
  }

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
  isBanned,
  trackSuspiciousActivity  // Export for use in rate limiters
};