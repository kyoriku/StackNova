// routes/api/postRoutes.js
const router = require('express').Router();
const postController = require('../../controllers/postController');
const withAuth = require('../../middleware/auth');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);
router.post('/', withAuth, postController.createPost);
router.put('/:id', withAuth, postController.updatePost);
router.delete('/:id', withAuth, postController.deletePost);

module.exports = router;