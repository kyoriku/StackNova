// routes/api/userRoutes.js
const router = require('express').Router();
const userController = require('../../controllers/userController');
const { loginLimiter } = require('../../middleware/rateLimiter');

router.post('/', userController.createUser);
router.post('/login', loginLimiter, userController.login);
router.post('/logout', userController.logout);
router.get('/session', userController.checkSession);

module.exports = router;