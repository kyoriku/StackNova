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
          },
          {
            model: Comment,
            include: [{
              model: User,
              attributes: ['username']
            }]
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

      // Get the user to access username
      const user = await User.findByPk(req.session.user_id, {
        attributes: ['username']
      });

      // Clear home page (new post for everyone) and user's dashboard (their new post)
      await Promise.all([
        redisService.clearHomePageCache(),
        redisService.clearUserPostsCache(req.session.user_id),
        redisService.clearUserProfileCache(user.username),
        redisService.invalidateSitemapCache()
      ]);

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
        include: [{
          model: User,
          attributes: ['username']
        }]
      });

      if (!post) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      const user = await User.findByPk(req.session.user_id, {
        attributes: ['username']
      });

      await post.update(req.body);

      // Clear post details and homepage since content changed
      await Promise.all([
        redisService.clearPostCache(req.params.id), // Don't clear comments
        redisService.clearHomePageCache(),
        redisService.clearUserPostsCache(req.session.user_id), // Clear user's dashboard as it's their post
        redisService.clearUserProfileCache(user.username),
        redisService.invalidateSitemapCache()
      ]);

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
      // First find the post to get the username
      const post = await Post.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
        include: [{
          model: User,
          attributes: ['username']
        }]
      });

      if (!post) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      // Delete the post
      await post.destroy();

      // Clear everything since the post is gone
      await Promise.all([
        redisService.clearPostCache(req.params.id, true), // Include comments since post is deleted
        redisService.clearHomePageCache(),
        redisService.clearUserPostsCache(req.session.user_id), // Clear user's dashboard 
        redisService.clearUserProfileCache(post.user.username), // Clear user's profile
        redisService.invalidateSitemapCache()
      ]);

      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};

module.exports = postController;