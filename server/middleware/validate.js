// middleware/validate.js
const { body, validationResult } = require('express-validator');

const validateNewPost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ min: 5, max: 25000 }).withMessage('Content must be between 5 and 25000 characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validatePostUpdate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ max: 25000 }).withMessage('Content must be less than 25000 characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateNewComment = [
  body('comment_text')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ min: 2, max: 5000 }).withMessage('Comment must be between 2 and 5000 characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCommentUpdate = [
  body('comment_text')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 5000 }).withMessage('Comment must be less than 5000 characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { 
  validateNewPost, 
  validatePostUpdate, 
  validateNewComment, 
  validateCommentUpdate 
};