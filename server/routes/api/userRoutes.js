const router = require('express').Router();
const userController = require('../../controllers/userController');
const withAuth = require('../../middleware/auth');
const cacheMiddleware = require('../../middleware/cache');
const { loginLimiter } = require('../../middleware/rateLimiter');
const { sessionSecurity, checkInactivity } = require('../../middleware/sessionSecurity');

// Public routes
router.post('/', userController.createUser);
router.post('/login', loginLimiter, userController.login);
router.get('/session', userController.checkSession);
router.get('/profile/:username', cacheMiddleware, userController.getUserProfile);
router.post('/logout', userController.logout);

// Protected routes (require authentication)
router.post('/logout-all', sessionSecurity, checkInactivity, withAuth, userController.logoutAllDevices);
router.get('/heartbeat', sessionSecurity, checkInactivity, withAuth, userController.heartbeat);

module.exports = router;