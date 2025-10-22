const router = require('express').Router();
const commentController = require('../../controllers/commentController');
const withAuth = require('../../middleware/auth');
const { commentLimiter } = require('../../middleware/rateLimiter');
const { validateNewComment, validateCommentUpdate } = require('../../middleware/validate');
const { sessionSecurity, checkInactivity } = require('../../middleware/sessionSecurity');

// Protected routes (require authentication)
router.post('/', sessionSecurity, checkInactivity, withAuth, commentLimiter, validateNewComment, commentController.createComment);
router.put('/:id', sessionSecurity, checkInactivity, withAuth, validateCommentUpdate, commentController.updateComment);
router.delete('/:id', sessionSecurity, checkInactivity, withAuth, commentController.deleteComment);

module.exports = router;