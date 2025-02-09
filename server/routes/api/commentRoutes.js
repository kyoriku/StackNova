// routes/api/commentRoutes.js
const router = require('express').Router();
const commentController = require('../../controllers/commentController');

router.get('/post/:postId', commentController.getPostComments);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;