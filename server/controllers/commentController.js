// controllers/commentController.js
const { Comment, User } = require('../models');
const redisService = require('../config/redis');

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
        order: [['created_at', 'DESC']]
      });

      res.json(comments.map(comment => comment.get({ plain: true })));
    } catch (err) {
      res.status(500).json(err);
    }
  },

//   // Create a new comment
//   async createComment(req, res) {
//     try {
//       const newComment = await Comment.create({
//         comment_text: req.body.comment_text,
//         user_id: req.session.user_id,
//         post_id: req.body.post_id
//       });

//       // Clear cache for the associated post
//       await redisService.clearPostCache(req.body.post_id);

//       res.status(201).json(newComment.get({ plain: true }));
//     } catch (err) {
//       console.error(err);
//       res.status(400).json({
//         error: 'Unable to create comment'
//       });
//     }
//   },

//   // Update a comment
//   async updateComment(req, res) {
//     try {
//       const comment = await Comment.findOne({
//         where: {
//           id: req.params.id,
//           user_id: req.session.user_id
//         }
//       });

//       if (!comment) {
//         res.status(404).json({
//           error: 'Comment not found or not authorized'
//         });
//         return;
//       }

//       await comment.update({ comment_text: req.body.comment_text });

//       // Clear cache for the associated post
//       await redisService.clearPostCache(comment.post_id);

//       res.status(200).json({ 
//         message: 'Comment updated successfully',
//         comment: comment.get({ plain: true })
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({
//         error: 'Internal server error'
//       });
//     }
//   },

//   // Delete a comment
//   async deleteComment(req, res) {
//     try {
//       const comment = await Comment.findOne({
//         where: {
//           id: req.params.id,
//           user_id: req.session.user_id
//         }
//       });

//       if (!comment) {
//         res.status(404).json({
//           error: 'Comment not found or not authorized'
//         });
//         return;
//       }

//       const postId = comment.post_id;
//       await comment.destroy();

//       // Clear cache for the associated post
//       await redisService.clearPostCache(postId);

//       res.status(200).json({
//         message: 'Comment deleted successfully'
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({
//         error: 'Internal server error'
//       });
//     }
//   }
// };
  // Create a new comment
  async createComment(req, res) {
    try {
      const newComment = await Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
      });

      // Clear both the post cache and homepage cache
      await Promise.all([
        redisService.clearPostCache(req.body.post_id, true),
        redisService.clearHomePageCache()
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
        }
      });

      if (!comment) {
        res.status(404).json({
          error: 'Comment not found or not authorized'
        });
        return;
      }

      await comment.update({ comment_text: req.body.comment_text });

      // Clear both the post cache and homepage cache
      await Promise.all([
        redisService.clearPostCache(comment.post_id, true),
        redisService.clearHomePageCache()
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
        }
      });

      if (!comment) {
        res.status(404).json({
          error: 'Comment not found or not authorized'
        });
        return;
      }

      const postId = comment.post_id;
      await comment.destroy();

      // Clear both the post cache and homepage cache
      await Promise.all([
        redisService.clearPostCache(postId, true),
        redisService.clearHomePageCache()
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