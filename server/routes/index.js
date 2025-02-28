// routes/index.js
const router = require('express').Router();
const apiRoutes = require('./api');
const sitemapRoutes = require('./sitemapRoutes');

router.use('/api', apiRoutes);
router.use('/', sitemapRoutes);

module.exports = router;