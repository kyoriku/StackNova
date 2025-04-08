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

module.exports = router;