// controllers/commentController.js
const { Comment, User } = require('../models');
const redisService = require('../utils/redis');

const commentController = {
  // Get comments for a post
  async getPostComments(req, res) {
    try {
      const comments = await Comment.findAll({
        where: {
          post_id: req.params.postId
        },
        include: [{
          model: User,
          attributes: ['username']
        }],
        // order: [['created_at', 'DESC']]
      });

      res.json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new comment
  async createComment(req, res) {
    try {
      const newComment = await Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
      });

      // Clear cache for the associated post and its comments
      await redisService.clearPostCache(req.body.post_id);

      res.status(201).json(newComment);
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
      const commentData = await Comment.findByPk(req.params.id);

      if (!commentData) {
        res.status(404).json({
          error: 'Comment not found'
        });
        return;
      }

      // Verify the comment belongs to the user
      if (commentData.user_id !== req.session.user_id) {
        res.status(403).json({
          error: 'Not authorized to edit this comment'
        });
        return;
      }

      // Update the comment
      const [updatedRows] = await Comment.update(
        { comment_text: req.body.comment_text },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id
          }
        }
      );

      if (updatedRows === 0) {
        res.status(404).json({ message: 'No comment found with this id!' });
        return;
      }

      // Clear cache for the associated post and its comments
      await redisService.clearPostCache(commentData.post_id);

      res.status(200).json({ message: 'Comment updated successfully' });
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
      const commentData = await Comment.findByPk(req.params.id);

      if (!commentData) {
        res.status(404).json({
          error: 'Comment not found'
        });
        return;
      }

      // Verify the comment belongs to the user
      if (commentData.user_id !== req.session.user_id) {
        res.status(403).json({
          error: 'Not authorized to delete this comment'
        });
        return;
      }

      await commentData.destroy();

      // Clear cache for the associated post and its comments
      await redisService.clearPostCache(commentData.post_id);

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