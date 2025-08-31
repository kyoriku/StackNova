const router = require('express').Router();
const apiRoutes = require('./api');
const sitemapRoutes = require('./sitemapRoutes');

router.use('/api', apiRoutes);
router.use('/', sitemapRoutes);
router.use('/auth', require('./auth'));

module.exports = router;