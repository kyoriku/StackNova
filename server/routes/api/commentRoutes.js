// routes/api/commentRoutes.js
const router = require('express').Router();
const commentController = require('../../controllers/commentController');
const withAuth = require('../../middleware/auth');

router.get('/post/:postId', commentController.getPostComments);
router.post('/', withAuth, commentController.createComment);
router.put('/:id', withAuth, commentController.updateComment);
router.delete('/:id', withAuth, commentController.deleteComment);

module.exports = router;