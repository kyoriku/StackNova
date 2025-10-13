const faviconHeaders = (req, res, next) => {
  if (req.path === '/favicon.svg') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', 'image/svg+xml');
  }
  next();
};

module.exports = faviconHeaders;