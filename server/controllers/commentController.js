// controllers/commentController.js
const { Comment, User } = require('../models');
const redisService = require('../config/redis');

const commentController = {
  // Create a new comment
  async createComment(req, res) {
    try {
      const newComment = await Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
      });

      // Get the user to access username
      const user = await User.findByPk(req.session.user_id, {
        attributes: ['username']
      });

      // Clear caches
      await Promise.all([
        redisService.clearPostCache(req.body.post_id, true),
        redisService.clearHomePageCache(),
        redisService.clearUserProfileCache(user.username),
        redisService.invalidateSitemapCache()
      ]);

      res.status(201).json(newComment.get({ plain: true }));
    } catch (err) {
      console.error(err);
      res.status(400).json({
        error: 'Unable to create comment'
      });
    }
  },

  // Update a comment
  async updateComment(req, res) {
    try {
      const comment = await Comment.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id
        },
        include: [{
          model: User,
          attributes: ['username']
        }]
      });

      if (!comment) {
        res.status(404).json({
          error: 'Comment not found or not authorized'
        });
        return;
      }

      await comment.update({ comment_text: req.body.comment_text });

      // Clear caches
      await Promise.all([
        redisService.clearPostCache(comment.post_id, true),
        redisService.clearHomePageCache(),
        redisService.clearUserProfileCache(comment.user.username),
        redisService.invalidateSitemapCache()
      ]);

      res.status(200).json({
        message: 'Comment updated successfully',
        comment: comment.get({ plain: true })
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const comment = await Comment.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id
        },
        include: [{
          model: User,
          attributes: ['username']
        }]
      });

      if (!comment) {
        res.status(404).json({
          error: 'Comment not found or not authorized'
        });
        return;
      }

      const postId = comment.post_id;
      const username = comment.user.username;

      await comment.destroy();

      // Clear caches
      await Promise.all([
        redisService.clearPostCache(postId, true),
        redisService.clearHomePageCache(),
        redisService.clearUserProfileCache(username),
        redisService.invalidateSitemapCache()
      ]);

      res.status(200).json({
        message: 'Comment deleted successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

module.exports = commentController;