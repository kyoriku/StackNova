const { Post, User, Comment } = require('../models');
const { generateUniqueSlug } = require('../utils/slugUtils');
const redisService = require('../config/redisCache');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const ERROR_CODES = require('../constants/errorCodes');

// Helper function to handle common Redis cache operations
async function clearCaches(postId, userId, username, includeComments = false) {
  const cacheOps = [
    redisService.clearHomePageCache(),
    redisService.clearUserPostsCache(userId),
    redisService.clearUserProfileCache(username),
    redisService.invalidateSitemapCache()
  ];

  if (postId) {
    const post = await Post.findByPk(postId, { attributes: ['id', 'slug'] });
    if (post) {
      cacheOps.push(redisService.clearPostCache(post.id, includeComments));
      cacheOps.push(redisService.clearPostCache(post.slug, includeComments));
    } else {
      cacheOps.push(redisService.clearPostCache(postId, includeComments));
    }
  }

  return Promise.all(cacheOps);
}

// Common post query options
const postQueryOptions = {
  include: [
    {
      model: User,
      attributes: ['username']
    },
    {
      model: Comment,
      include: [{
        model: User,
        attributes: ['username']
      }]
    }
  ]
};

// Helper function to determine if a string is a UUID
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const postController = {
  // Get all posts
  getAllPosts: asyncHandler(async (req, res) => {
    const postData = await Post.findAll({
      ...postQueryOptions,
      order: [['created_at', 'DESC']]
    });

    const posts = postData.map(post => post.get({ plain: true }));
    res.json(posts);
  }),

  getSinglePost: asyncHandler(async (req, res) => {
    const identifier = req.params.identifier;
    let whereClause;

    // Determine if the identifier is a UUID or a slug
    if (isUUID(identifier)) {
      whereClause = { id: identifier };
    } else {
      whereClause = { slug: identifier };
    }

    const postData = await Post.findOne({
      where: whereClause,
      ...postQueryOptions
    });

    if (!postData) {
      throw new AppError(
        'No post found with this identifier',
        404,
        ERROR_CODES.POST_NOT_FOUND
      );
    }

    // Handle UUID requests for SEO
    if (isUUID(identifier)) {
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
      const userAgent = req.headers['user-agent'] || '';

      const isBrowserNavigation = acceptsHtml && userAgent && !acceptsJson;
      const isApiCall = acceptsJson || req.headers['x-requested-with'] === 'XMLHttpRequest';

      if (isBrowserNavigation) {
        return res.redirect(301, `/post/${postData.slug}`);
      } else {
        return res.json(postData.get({ plain: true }));
      }
    }

    res.json(postData.get({ plain: true }));
  }),

  // Get posts for current user
  getUserPosts: asyncHandler(async (req, res) => {
    if (!req.session.user_id) {
      throw new AppError(
        'You must be logged in to view your posts',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(postData.map(post => post.get({ plain: true })));
  }),

  // Create a post
  createPost: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
      throw new AppError(
        'You must be logged in to create a post',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    if (!req.body.title || !req.body.content) {
      throw new AppError(
        'Title and content are required',
        400,
        ERROR_CODES.INVALID_INPUT
      );
    }

    const user = await User.findByPk(userId, {
      attributes: ['username']
    });

    if (!user) {
      throw new AppError(
        'User not found',
        404,
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    // Generate slug using utility function
    const slug = await generateUniqueSlug(req.body.title);

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      slug: slug,
      user_id: userId,
      username: user.username
    });

    const postWithDetails = await Post.findByPk(newPost.id, {
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['username']
          }]
        }
      ]
    });

    // Clear relevant caches BEFORE sending response
    await clearCaches(null, userId, user.username);

    res.status(201).json(postWithDetails.get({ plain: true }));
  }),

  updatePost: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;
    const identifier = req.params.identifier;

    if (!userId) {
      throw new AppError(
        'You must be logged in to update a post',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    let whereClause = { user_id: userId };
    if (isUUID(identifier)) {
      whereClause.id = identifier;
    } else {
      whereClause.slug = identifier;
    }

    const post = await Post.findOne({
      where: whereClause,
      include: [{ model: User, attributes: ['username'] }]
    });

    if (!post) {
      throw new AppError(
        'Post not found or you are not authorized to edit it',
        404,
        ERROR_CODES.POST_NOT_FOUND
      );
    }

    // If title is changing, generate new slug
    const updateData = { ...req.body };
    if (req.body.title && req.body.title !== post.title) {
      updateData.slug = await generateUniqueSlug(req.body.title, post.id);
    }

    await post.update(updateData);

    // Fetch the updated post with all relations
    const updatedPostWithDetails = await Post.findByPk(post.id, {
      ...postQueryOptions
    });

    // Clear relevant caches BEFORE sending response
    await clearCaches(post.id, userId, post.user.username);

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPostWithDetails.get({ plain: true })
    });
  }),

  // Delete a post
  deletePost: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;
    const identifier = req.params.identifier;

    if (!userId) {
      throw new AppError(
        'You must be logged in to delete a post',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Determine if the identifier is a UUID or slug
    let whereClause = { user_id: userId };
    if (isUUID(identifier)) {
      whereClause.id = identifier;
    } else {
      whereClause.slug = identifier;
    }

    // Find the post to validate ownership
    const post = await Post.findOne({
      where: whereClause,
      include: [{ model: User, attributes: ['username'] }]
    });

    if (!post) {
      throw new AppError(
        'Post not found or you are not authorized to delete it',
        404,
        ERROR_CODES.POST_NOT_FOUND
      );
    }

    // Delete the post
    await post.destroy();

    // Clear relevant caches BEFORE sending response
    await clearCaches(post.id, userId, post.user.username, true);

    res.status(200).json({ message: 'Post deleted successfully' });
  })
};

module.exports = postController;