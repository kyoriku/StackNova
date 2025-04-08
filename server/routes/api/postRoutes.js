const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');
const cacheMiddleware = require('../../middleware/cache');
const { postLimiter } = require('../../middleware/rateLimiter');
const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');

router.get('/', cacheMiddleware, postController.getAllPosts);
router.get('/user/posts', cacheMiddleware, postController.getUserPosts);
router.get('/:id', cacheMiddleware, postController.getSinglePost);
router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
router.put('/:id', withAuth, validatePostUpdate, postController.updatePost);
router.delete('/:id', withAuth, postController.deletePost);

module.exports = router;