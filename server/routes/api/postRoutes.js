const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');
const cacheMiddleware = require('../../middleware/cache');
const { postLimiter } = require('../../middleware/rateLimiter');
const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');

// Public routes
router.get('/', cacheMiddleware, postController.getAllPosts);
router.get('/user/posts', cacheMiddleware, postController.getUserPosts);
router.get('/:identifier', cacheMiddleware, postController.getSinglePost);

// Protected routes (require authentication)
router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
router.put('/:identifier', withAuth, validatePostUpdate, postController.updatePost);
router.delete('/:identifier', withAuth, postController.deletePost);

module.exports = router;