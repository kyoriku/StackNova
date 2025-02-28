// routes/api/postRoutes.js
const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');
const { postLimiter } = require('../../middleware/rateLimiter');
const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');
const cacheMiddleware = require('../../middleware/cache');

router.get('/', cacheMiddleware, postController.getAllPosts);
router.get('/user/posts', cacheMiddleware, postController.getUserPosts);
router.get('/:id', cacheMiddleware, postController.getSinglePost);
router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
router.put('/:id', withAuth, validatePostUpdate, postController.updatePost);
router.delete('/:id', withAuth, postController.deletePost);

// if (process.env.NODE_ENV === 'development') {
//   router.post('/debug/clear-cache', async (req, res) => {
//     await redisService.clearAllPostsCache();
//     res.json({ message: 'Cache cleared' });
//   });
// }

module.exports = router;