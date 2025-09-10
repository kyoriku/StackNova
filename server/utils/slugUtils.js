const { Post } = require('../models');

// Utility function to generate URL-safe slugs
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Function to ensure slug uniqueness
const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const whereClause = { slug };
    if (excludeId) {
      whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }

    const existingPost = await Post.findOne({ where: whereClause });
    
    if (!existingPost) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    if (counter > 1000) {
      throw new Error('Unable to generate unique slug after 1000 attempts');
    }
  }
};

module.exports = {
  generateSlug,
  generateUniqueSlug
};