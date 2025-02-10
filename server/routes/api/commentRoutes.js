// routes/api/commentRoutes.js
const router = require('express').Router();
const commentController = require('../../controllers/commentController');
const withAuth = require('../../middleware/auth');
const { commentLimiter } = require('../../middleware/rateLimiter');

router.get('/post/:postId', commentController.getPostComments);
router.post('/', withAuth, commentLimiter, commentController.createComment);
router.put('/:id', withAuth, commentController.updateComment);
router.delete('/:id', withAuth, commentController.deleteComment);

module.exports = router;