// const router = require('express').Router();
// const userController = require('../../controllers/userController');
// const withAuth = require('../../middleware/auth');
// const cacheMiddleware = require('../../middleware/cache');
// const { loginLimiter } = require('../../middleware/rateLimiter');

// router.post('/', userController.createUser);
// router.post('/login', loginLimiter, userController.login);
// router.post('/logout', userController.logout); // CSRF applied in server.js
// router.post('/logout-all', withAuth, userController.logoutAllDevices); // NEW + CSRF
// router.get('/session', userController.checkSession);
// router.get('/profile/:username', cacheMiddleware, userController.getUserProfile);

// module.exports = router;

const router = require('express').Router();
const userController = require('../../controllers/userController');
const withAuth = require('../../middleware/auth');
const cacheMiddleware = require('../../middleware/cache');
const { loginLimiter } = require('../../middleware/rateLimiter');

// Public routes
router.post('/', userController.createUser);
router.post('/login', loginLimiter, userController.login);
router.get('/session', userController.checkSession);
router.get('/profile/:username', cacheMiddleware, userController.getUserProfile);

// Protected routes (require authentication)
router.post('/logout', withAuth, userController.logout);
router.post('/logout-all', withAuth, userController.logoutAllDevices);

module.exports = router;