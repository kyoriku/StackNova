const { Post } = require('../models');
const { Op } = require('sequelize');

// Utility function to generate URL-safe slugs
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Extract base slug and counter from a slug like "my-post-3"
const parseSlugWithCounter = (slug) => {
  const match = slug.match(/^(.+)-(\d+)$/);
  if (match) {
    return {
      base: match[1],
      counter: parseInt(match[2], 10)
    };
  }
  return { base: slug, counter: 0 };
};

// Find the next available counter for a slug
// This uses a single DB query to find the highest counter
const findNextCounter = async (baseSlug, excludeId = null) => {
  const whereClause = {
    slug: {
      [Op.or]: [
        baseSlug,                              // Exact match
        { [Op.like]: `${baseSlug}-%` }        // Match with counter
      ]
    }
  };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  // Get all posts with similar slugs
  const existingPosts = await Post.findAll({
    where: whereClause,
    attributes: ['slug'],
    raw: true
  });

  if (existingPosts.length === 0) {
    return 0; // No conflicts, use base slug
  }

  // Find the highest counter
  let maxCounter = 0;
  
  for (const post of existingPosts) {
    const parsed = parseSlugWithCounter(post.slug);
    if (parsed.base === baseSlug && parsed.counter > maxCounter) {
      maxCounter = parsed.counter;
    }
  }

  // If base slug exists without counter, that counts as counter 0
  const baseExists = existingPosts.some(p => p.slug === baseSlug);
  if (baseExists && maxCounter === 0) {
    maxCounter = 0;
  }

  return maxCounter + 1;
};

// Generate unique slug with clean counters
const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = generateSlug(title);
  
  // Find next available counter
  const counter = await findNextCounter(baseSlug, excludeId);
  
  if (counter === 0) {
    return baseSlug; // Clean slug, no collision
  }
  
  return `${baseSlug}-${counter}`; // Clean counter: my-post-2, my-post-3, etc.
};

// Alternative: Simpler version that relies on controller retry logic
// This is actually the BEST approach for race condition safety
const generateSlugWithoutCheck = (title) => {
  return generateSlug(title);
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  generateSlugWithoutCheck,
  findNextCounter  // Export for use in controller
};