// routes/sitemapRoutes.js
const router = require('express').Router();
const { generateSitemap } = require('../utils/sitemapGenerator');

// Serve the sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap(req);

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Serve the robots.txt
// router.get('/robots.txt', (req, res) => {
//   const protocol = req.protocol;
//   const host = req.get('host');
//   const baseUrl = `${protocol}://${host}`;

//   const robotsTxt = `User-agent: *
// Allow: /
// Allow: /post/
// Allow: /user/
// Disallow: /login
// Disallow: /signup
// Disallow: /dashboard
// Disallow: /new-post
// Disallow: /edit-post/

// # Sitemap
// Sitemap: ${baseUrl}/sitemap.xml`;

//   res.type('text/plain');
//   res.send(robotsTxt);
// });

module.exports = router;