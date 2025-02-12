// routes/api/postRoutes.js
const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');
const { postLimiter } = require('../../middleware/rateLimiter');
const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');
const cacheMiddleware = require('../../middleware/cache');

router.get('/', cacheMiddleware, postController.getAllPosts);
router.get('/:id', cacheMiddleware, postController.getSinglePost);
router.get('/user/posts', cacheMiddleware, postController.getUserPosts);
router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
router.put('/:id', withAuth, validatePostUpdate, postController.updatePost);
router.delete('/:id', withAuth, postController.deletePost);

module.exports = router;