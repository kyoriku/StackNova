// routes/api/index.js
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// serve up react front-end in production
if (process.env.NODE_ENV === 'production') {
  router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

module.exports = router;