// middleware/validate.js
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Custom sanitizer that preserves line breaks and markdown
const sanitizeMarkdown = (text) => {
  // First, temporarily replace code blocks with placeholders
  const codeBlocks = [];
  let index = 0;
  const textWithPlaceholders = text.replace(/```[\s\S]*?```/g, match => {
    const placeholder = `__CODE_BLOCK_${index}__`;
    codeBlocks.push(match);
    index++;
    return placeholder;
  });

  // Configure sanitize-html to allow markdown syntax
  const options = {
    allowedTags: [], // Strip all HTML tags
    allowedAttributes: {}, // Strip all attributes
    disallowedTagsMode: 'keep', // Changed from 'escape' to 'keep'
    parser: {
      decodeEntities: true
    }
  };

  // Sanitize the text while preserving line breaks
  let sanitized = sanitizeHtml(textWithPlaceholders, options);

  // Preserve consecutive newlines (limit to max 2 for paragraph breaks)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // Put code blocks back
  codeBlocks.forEach((block, i) => {
    sanitized = sanitized.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return sanitized;
};

// Custom validator for code blocks
const validateCodeBlocks = (text) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = text.match(codeBlockRegex) || [];

  // Ensure code blocks aren't too large (e.g., 10000 chars max)
  for (const block of matches) {
    if (block.length > 10000) {
      throw new Error('Code blocks must be less than 10000 characters');
    }
  }

  return true;
};

const validateNewPost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters')
    .customSanitizer(sanitizeMarkdown),

  body('content')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ min: 5, max: 25000 }).withMessage('Content must be between 5 and 25000 characters')
    .customSanitizer(sanitizeMarkdown),

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
    .customSanitizer(sanitizeMarkdown),

  body('content')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ max: 25000 }).withMessage('Content must be less than 25000 characters')
    .customSanitizer(sanitizeMarkdown),

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
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ min: 2, max: 5000 }).withMessage('Comment must be between 2 and 5000 characters')
    .customSanitizer(sanitizeMarkdown),

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
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 5000 }).withMessage('Comment must be less than 5000 characters')
    .customSanitizer(sanitizeMarkdown),

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