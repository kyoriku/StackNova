// routes/api/userRoutes.js
const router = require('express').Router();
const userController = require('../../controllers/userController');

router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;