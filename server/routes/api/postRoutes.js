// routes/api/postRoutes.js
const router = require('express').Router();
const postController = require('../../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;