// controllers/postController.js
const { Post, User, Comment } = require('../models');
const redisService = require('../config/redis');

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
        order: [['created_at', 'DESC']]
      });

      const posts = postData.map(post => post.get({ plain: true }));
      res.json(posts);
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
            }]
          }
        ]
      });

      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      res.json(postData.get({ plain: true }));
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getUserPosts(req, res) {
    try {
      const postData = await Post.findAll({
        where: {
          user_id: req.session.user_id
        },
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(postData.map(post => post.get({ plain: true })));
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

      // Clear caches since we added new content
      await redisService.clearAllPostsCache();
      await redisService.clearUserPostsCache(req.session.user_id);

      res.status(201).json(newPost.get({ plain: true }));
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update a post
  async updatePost(req, res) {
    try {
      const post = await Post.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (!post) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      await post.update(req.body);

      // Clear relevant caches
      await redisService.clearPostCache(req.params.id);
      await redisService.clearAllPostsCache();
      await redisService.clearUserPostsCache(req.session.user_id);

      res.status(200).json({ 
        message: 'Post updated successfully!',
        post: post.get({ plain: true })
      });
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

      // Clear all relevant caches
      await redisService.clearPostCache(req.params.id, req.session.user_id);
      await redisService.clearAllPostsCache();
      await redisService.clearUserPostsCache(req.session.user_id);

      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = postController;