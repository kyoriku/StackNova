const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Custom sanitizer that preserves line breaks and markdown
const sanitizeMarkdown = (text) => {
  // First, preserve markdown links
  const markdownLinks = [];
  let mlIndex = 0;
  const textWithLinks = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `__MD_LINK_${mlIndex}__`;
    markdownLinks.push(match);
    mlIndex++;
    return placeholder;
  });

  // Preserve inline code (single backticks)
  const inlineCodes = [];
  let icIndex = 0;
  const textWithInlineCode = textWithLinks.replace(/`([^`\n]+)`/g, (match) => {
    const placeholder = `__INLINE_CODE_${icIndex}__`;
    inlineCodes.push(match);
    icIndex++;
    return placeholder;
  });

  // Preserve code blocks (triple backticks)
  const codeBlocks = [];
  let cbIndex = 0;
  const textWithCodeBlocks = textWithInlineCode.replace(/```[\s\S]*?```/g, match => {
    const placeholder = `__CODE_BLOCK_${cbIndex}__`;
    codeBlocks.push(match);
    cbIndex++;
    return placeholder;
  });

  // Preserve blockquotes
  const blockquotes = [];
  let bqIndex = 0;
  const textWithAllPlaceholders = textWithCodeBlocks.replace(/^>\s*(.*?)$/gm, match => {
    const placeholder = `__BLOCKQUOTE_${bqIndex}__`;
    blockquotes.push(match);
    bqIndex++;
    return placeholder;
  });

  // Configure sanitize-html to strip HTML tags
  const options = {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape',
    parser: {
      decodeEntities: true
    }
  };

  // Sanitize the text
  let sanitized = sanitizeHtml(textWithAllPlaceholders, options);

  // Preserve consecutive newlines (limit to max 2 for paragraph breaks)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // Restore in reverse order
  blockquotes.forEach((block, i) => {
    sanitized = sanitized.replace(`__BLOCKQUOTE_${i}__`, block);
  });

  codeBlocks.forEach((block, i) => {
    sanitized = sanitized.replace(`__CODE_BLOCK_${i}__`, block);
  });

  inlineCodes.forEach((code, i) => {
    sanitized = sanitized.replace(`__INLINE_CODE_${i}__`, code);
  });

  markdownLinks.forEach((link, i) => {
    sanitized = sanitized.replace(`__MD_LINK_${i}__`, link);
  });

  return sanitized;
};

// Validate markdown links for malicious URLs
const validateMarkdownLinks = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = [...text.matchAll(linkRegex)];
  
  for (const match of matches) {
    const url = match[2].trim();
    
    // Block dangerous protocols
    if (/^(javascript|data|vbscript|file):/i.test(url)) {
      throw new Error('Links with dangerous protocols are not allowed');
    }
    
    // Ensure URLs are properly formatted if they have a protocol
    if (url.includes(':') && !/^https?:\/\//i.test(url)) {
      throw new Error('Only http and https links are allowed');
    }
  }
  
  return true;
};

// Validate inline code length
const validateInlineCode = (text) => {
  const inlineCodeRegex = /`([^`\n]+)`/g;
  const matches = text.match(inlineCodeRegex) || [];
  
  for (const code of matches) {
    if (code.length > 500) {
      throw new Error('Inline code must be less than 500 characters');
    }
  }
  
  return true;
};

// Validate code blocks
const validateCodeBlocks = (text) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = text.match(codeBlockRegex) || [];

  for (const block of matches) {
    if (block.length > 10000) {
      throw new Error('Code blocks must be less than 10000 characters');
    }
  }

  return true;
};

// Prevent markdown syntax abuse
const validateMarkdownSyntax = (text) => {
  // Limit consecutive special characters (prevent spam/abuse)
  if (/([*_`~#>\-=])\1{50,}/.test(text)) {
    throw new Error('Too many consecutive special characters');
  }
  
  return true;
};

// Middleware to validate new post creation
const validateNewPost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters')
    .customSanitizer(sanitizeMarkdown),

  body('content')
    .custom(validateMarkdownLinks).withMessage('Invalid or dangerous links detected')
    .custom(validateInlineCode).withMessage('Inline code too long')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .custom(validateMarkdownSyntax).withMessage('Invalid markdown syntax')
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

// Middleware to validate post updates
const validatePostUpdate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters')
    .customSanitizer(sanitizeMarkdown),

  body('content')
    .custom(validateMarkdownLinks).withMessage('Invalid or dangerous links detected')
    .custom(validateInlineCode).withMessage('Inline code too long')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .custom(validateMarkdownSyntax).withMessage('Invalid markdown syntax')
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

// Middleware to validate new comment creation
const validateNewComment = [
  body('comment_text')
    .custom(validateMarkdownLinks).withMessage('Invalid or dangerous links detected')
    .custom(validateInlineCode).withMessage('Inline code too long')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .custom(validateMarkdownSyntax).withMessage('Invalid markdown syntax')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ min: 2, max: 7500 }).withMessage('Comment must be between 2 and 7500 characters')
    .customSanitizer(sanitizeMarkdown),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware to validate comment updates
const validateCommentUpdate = [
  body('comment_text')
    .custom(validateMarkdownLinks).withMessage('Invalid or dangerous links detected')
    .custom(validateInlineCode).withMessage('Inline code too long')
    .custom(validateCodeBlocks).withMessage('Code blocks are too large')
    .custom(validateMarkdownSyntax).withMessage('Invalid markdown syntax')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 7500 }).withMessage('Comment must be less than 7500 characters')
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