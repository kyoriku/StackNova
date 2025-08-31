// // const router = require('express').Router();
// // const passport = require('../config/passport');
// // const userController = require('../controllers/userController');

// // // Google OAuth routes
// // router.get('/google',
// //   passport.authenticate('google', {
// //     scope: ['profile', 'email']
// //   })
// // );

// // router.get('/google/callback',
// //   passport.authenticate('google', { 
// //     failureRedirect: '/auth/failure',
// //     session: false // We handle sessions manually
// //   }),
// //   userController.googleCallback
// // );

// // router.get('/failure', userController.oauthFailure);

// // module.exports = router;

// const router = require('express').Router();
// const passport = require('../config/passport');
// const userController = require('../controllers/userController');
// const { oauthLimiter } = require('../middleware/rateLimiter');

// // Google OAuth routes with rate limiting
// router.get('/google',
//   oauthLimiter,
//   passport.authenticate('google', {
//     scope: ['profile', 'email']
//   })
// );

// router.get('/google/callback',
//   oauthLimiter,
//   passport.authenticate('google', { 
//     failureRedirect: '/auth/failure',
//     session: false
//   }),
//   userController.googleCallback
// );

// router.get('/failure', userController.oauthFailure);

// module.exports = router;

const router = require('express').Router();
const passport = require('../config/passport');
const userController = require('../controllers/userController');
const { oauthLimiter } = require('../middleware/rateLimiter');

// Google OAuth routes with rate limiting
router.get('/google',
  oauthLimiter,
  (req, res, next) => {
    // Pass the state parameter to passport
    const state = req.query.state;
    req.session.oauth_state = state; // Store state in session temporarily

    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: state // Pass state to Google
    })(req, res, next);
  }
);

router.get('/google/callback',
  oauthLimiter,
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false
  }),
  userController.googleCallback
);

router.get('/failure', userController.oauthFailure);

module.exports = router;