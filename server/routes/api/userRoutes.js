const router = require('express').Router();
const userController = require('../../controllers/userController');
const cacheMiddleware = require('../../middleware/cache');
const { loginLimiter } = require('../../middleware/rateLimiter');

router.post('/', userController.createUser);
router.post('/login', loginLimiter, userController.login);
router.post('/logout', userController.logout);
router.get('/session', userController.checkSession);
router.get('/profile/:username', cacheMiddleware, userController.getUserProfile);

module.exports = router;