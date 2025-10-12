// const router = require('express').Router();
// const postController = require('../../controllers/postController');
// const withAuth = require('../../middleware/auth');
// const cacheMiddleware = require('../../middleware/cache');
// const { postLimiter } = require('../../middleware/rateLimiter');
// const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');

// // Get all posts
// router.get('/', cacheMiddleware, postController.getAllPosts);

// // Get posts for current user
// router.get('/user/posts', withAuth, cacheMiddleware, postController.getUserPosts);

// // Get a single post by slug or ID
// router.get('/:identifier', cacheMiddleware, postController.getSinglePost);

// // Create a new post
// router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);

// // Update a post by slug or ID
// router.put('/:identifier', withAuth, validatePostUpdate, postController.updatePost);

// // Delete a post by slug or ID
// router.delete('/:identifier', withAuth, postController.deletePost);

// // router.get('/', cacheMiddleware, postController.getAllPosts);
// // router.get('/user/posts', cacheMiddleware, postController.getUserPosts);
// // router.get('/:id', cacheMiddleware, postController.getSinglePost);
// // router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
// // router.put('/:id', withAuth, validatePostUpdate, postController.updatePost);
// // router.delete('/:id', withAuth, postController.deletePost);

// module.exports = router;

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