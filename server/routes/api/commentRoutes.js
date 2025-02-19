// routes/api/commentRoutes.js
const router = require('express').Router();
const commentController = require('../../controllers/commentController');
const withAuth = require('../../middleware/auth');
const { commentLimiter } = require('../../middleware/rateLimiter');
const { validateNewComment, validateCommentUpdate } = require('../../middleware/validate');
const cacheMiddleware = require('../../middleware/cache');

// router.get('/post/:postId', cacheMiddleware, commentController.getPostComments);
router.post('/', withAuth, commentLimiter, validateNewComment, commentController.createComment);
router.put('/:id', withAuth, validateCommentUpdate, commentController.updateComment);
router.delete('/:id', withAuth, commentController.deleteComment);

module.exports = router;