// const router = require('express').Router();
// const commentController = require('../../controllers/commentController');
// const withAuth = require('../../middleware/auth');
// const { commentLimiter } = require('../../middleware/rateLimiter');
// const { validateNewComment, validateCommentUpdate } = require('../../middleware/validate');

// router.post('/', withAuth, commentLimiter, validateNewComment, commentController.createComment);
// router.put('/:id', withAuth, validateCommentUpdate, commentController.updateComment);
// router.delete('/:id', withAuth, commentController.deleteComment);

// module.exports = router;

const router = require('express').Router();
const commentController = require('../../controllers/commentController');
const withAuth = require('../../middleware/auth');
const { commentLimiter } = require('../../middleware/rateLimiter');
const { validateNewComment, validateCommentUpdate } = require('../../middleware/validate');

// Protected routes (require authentication)
router.post('/', withAuth, commentLimiter, validateNewComment, commentController.createComment);
router.put('/:id', withAuth, validateCommentUpdate, commentController.updateComment);
router.delete('/:id', withAuth, commentController.deleteComment);

module.exports = router;