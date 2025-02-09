// controllers/postController.js
const { Post, User, Comment } = require('../models');

const postController = {
  // Get all posts
  async getAllPosts(req, res) {
    try {
      const postData = await Post.findAll({
        include: [
          { 
            model: User, 
            attributes: ['username'] 
          }
        ],
        order: [['created_at', 'DESC']] // Most recent posts first
      });
      res.json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single post
  async getSinglePost(req, res) {
    try {
      const postData = await Post.findByPk(req.params.id, {
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
            }],
            order: [['created_at', 'DESC']] // Most recent comments first
          }
        ]
      });

      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      res.json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a post
  async createPost(req, res) {
    try {
      const newPost = await Post.create({
        ...req.body,
        user_id: req.session.user_id,
      });
      res.status(201).json(newPost);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update a post
  async updatePost(req, res) {
    try {
      const [updatedRows] = await Post.update(
        req.body,
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );

      if (updatedRows === 0) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      res.status(200).json({ message: 'Post updated successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const deletedRows = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (deletedRows === 0) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = postController;