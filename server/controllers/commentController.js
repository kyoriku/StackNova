const { Comment, User, Post } = require('../models');
const redisService = require('../config/redisCache');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const ERROR_CODES = require('../constants/errorCodes');

// Helper function to handle common Redis cache operations
async function clearCaches(postId, userId, username) {
  const cacheOps = [
    redisService.clearHomePageCache(),
    redisService.clearUserProfileCache(username),
    redisService.invalidateSitemapCache()
  ];

  if (postId) {
    // Clear cache for both post ID and slug
    const post = await Post.findByPk(postId, { attributes: ['id', 'slug'] });
    if (post) {
      // Clear cache for both UUID and slug versions
      cacheOps.push(redisService.clearPostCache(post.id, true)); // UUID version
      cacheOps.push(redisService.clearPostCache(post.slug, true)); // Slug version
    } else {
      // Fallback: just clear by ID if post not found
      cacheOps.push(redisService.clearPostCache(postId, true));
    }
  }

  if (userId) {
    cacheOps.push(redisService.clearUserPostsCache(userId));
  }

  return Promise.all(cacheOps);
}

const commentController = {
  // Create a new comment
  createComment: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;
    const postId = req.body.post_id;

    // Check authentication
    if (!userId) {
      throw new AppError(
        'You must be logged in to create a comment',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Check required fields
    if (!postId) {
      throw new AppError(
        'Post ID is required',
        400,
        ERROR_CODES.INVALID_INPUT
      );
    }

    if (!req.body.comment_text || !req.body.comment_text.trim()) {
      throw new AppError(
        'Comment text is required',
        400,
        ERROR_CODES.INVALID_INPUT
      );
    }

    // Verify user exists
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

    // Verify post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError(
        'Post not found',
        404,
        ERROR_CODES.POST_NOT_FOUND
      );
    }

    // Create the comment
    const newComment = await Comment.create({
      comment_text: req.body.comment_text,
      user_id: userId,
      post_id: postId
    });

    // Clear relevant caches
    await clearCaches(postId, userId, user.username);

    res.status(201).json(newComment.get({ plain: true }));
  }),

  // Update a comment
  updateComment: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;
    const commentId = req.params.id;

    // Check authentication
    if (!userId) {
      throw new AppError(
        'You must be logged in to update a comment',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    if (!req.body.comment_text || !req.body.comment_text.trim()) {
      throw new AppError(
        'Comment text is required',
        400,
        ERROR_CODES.INVALID_INPUT
      );
    }

    // Find comment and verify ownership
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        user_id: userId
      },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    if (!comment) {
      throw new AppError(
        'Comment not found or you are not authorized to edit it',
        404,
        ERROR_CODES.COMMENT_NOT_FOUND
      );
    }

    // Update the comment
    await comment.update({ comment_text: req.body.comment_text });

    // Clear relevant caches
    await clearCaches(comment.post_id, userId, comment.user.username);

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: comment.get({ plain: true })
    });
  }),

  // Delete a comment
  deleteComment: asyncHandler(async (req, res) => {
    const userId = req.session.user_id;
    const commentId = req.params.id;

    // Check authentication
    if (!userId) {
      throw new AppError(
        'You must be logged in to delete a comment',
        401,
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Find comment and verify ownership
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        user_id: userId
      },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    if (!comment) {
      throw new AppError(
        'Comment not found or you are not authorized to delete it',
        404,
        ERROR_CODES.COMMENT_NOT_FOUND
      );
    }

    const postId = comment.post_id;
    const username = comment.user.username;

    // Delete the comment
    await comment.destroy();

    // Clear relevant caches
    await clearCaches(postId, userId, username);

    res.status(200).json({ message: 'Comment deleted successfully' });
  })
};

module.exports = commentController;