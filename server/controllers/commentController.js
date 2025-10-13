const { Comment, User, Post } = require('../models'); // Add Post model
const redisService = require('../config/redisCache');

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
  async createComment(req, res) {
    try {
      const userId = req.session.user_id;
      const postId = req.body.post_id;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to create a comment' });
      }

      if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
      }

      // Get the user to access username
      const user = await User.findByPk(userId, {
        attributes: ['username']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newComment = await Comment.create({
        comment_text: req.body.comment_text,
        user_id: userId,
        post_id: postId
      });

      // Clear relevant caches
      await clearCaches(postId, userId, user.username);

      res.status(201).json(newComment.get({ plain: true }));
    } catch (err) {
      console.error('Error creating comment:', err);
      res.status(400).json({ message: 'Failed to create comment', error: err.message });
    }
  },

  // Update a comment
  async updateComment(req, res) {
    try {
      const userId = req.session.user_id;
      const commentId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to update a comment' });
      }

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
        return res.status(404).json({ message: 'No comment found with this id or you are not authorized to edit it' });
      }

      await comment.update({ comment_text: req.body.comment_text });

      // Clear relevant caches
      await clearCaches(comment.post_id, userId, comment.user.username);

      res.status(200).json({
        message: 'Comment updated successfully',
        comment: comment.get({ plain: true })
      });
    } catch (err) {
      console.error('Error updating comment:', err);
      res.status(500).json({ message: 'Failed to update comment', error: err.message });
    }
  },

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const userId = req.session.user_id;
      const commentId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to delete a comment' });
      }

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
        return res.status(404).json({ message: 'No comment found with this id or you are not authorized to delete it' });
      }

      const postId = comment.post_id;
      const username = comment.user.username;

      await comment.destroy();

      // Clear relevant caches
      await clearCaches(postId, userId, username);

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error('Error deleting comment:', err);
      res.status(500).json({ message: 'Failed to delete comment', error: err.message });
    }
  }
};

module.exports = commentController;