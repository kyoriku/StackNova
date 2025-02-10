// routes/api/postRoutes.js
const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');
const { postLimiter } = require('../../middleware/rateLimiter');
const { validateNewPost, validatePostUpdate } = require('../../middleware/validate');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);
router.post('/', withAuth, postLimiter, validateNewPost, postController.createPost);
router.put('/:id', withAuth, validatePostUpdate, postController.updatePost);
router.delete('/:id', withAuth, postController.deletePost);

module.exports = router;