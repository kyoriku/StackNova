const { Post, User, Comment } = require('../models');
const redisService = require('../config/redis');

// Helper function to handle common Redis cache operations
async function clearCaches(postId, userId, username, includeComments = false) {
  const cacheOps = [
    redisService.clearHomePageCache(),
    redisService.clearUserPostsCache(userId),
    redisService.clearUserProfileCache(username),
    redisService.invalidateSitemapCache()
  ];

  if (postId) {
    cacheOps.push(redisService.clearPostCache(postId, includeComments));
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

const postController = {
  // Get all posts
  async getAllPosts(req, res) {
    try {
      const postData = await Post.findAll({
        ...postQueryOptions,
        order: [['created_at', 'DESC']]
      });

      const posts = postData.map(post => post.get({ plain: true }));
      res.json(posts);
    } catch (err) {
      console.error('Error fetching all posts:', err);
      res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
  },

  // Get a single post
  async getSinglePost(req, res) {
    try {
      const postData = await Post.findByPk(req.params.id, postQueryOptions);

      if (!postData) {
        return res.status(404).json({ message: 'No post found with this id!' });
      }

      res.json(postData.get({ plain: true }));
    } catch (err) {
      console.error(`Error fetching post ${req.params.id}:`, err);
      res.status(500).json({ message: 'Failed to fetch post', error: err.message });
    }
  },

  // Get posts for current user
  async getUserPosts(req, res) {
    try {
      const postData = await Post.findAll({
        where: { user_id: req.session.user_id },
        include: [{ model: User, attributes: ['username'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json(postData.map(post => post.get({ plain: true })));
    } catch (err) {
      console.error('Error fetching user posts:', err);
      res.status(500).json({ message: 'Failed to fetch your posts', error: err.message });
    }
  },

  // Create a post
  async createPost(req, res) {
    try {
      const userId = req.session.user_id;
      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to create a post' });
      }

      // Get the user to access username
      const user = await User.findByPk(userId, {
        attributes: ['username']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newPost = await Post.create({
        ...req.body,
        user_id: userId,
      });

      // Clear relevant caches
      await clearCaches(null, userId, user.username);

      res.status(201).json(newPost.get({ plain: true }));
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(400).json({ message: 'Failed to create post', error: err.message });
    }
  },

  // Update a post
  async updatePost(req, res) {
    try {
      const userId = req.session.user_id;
      const postId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to update a post' });
      }

      const post = await Post.findOne({
        where: {
          id: postId,
          user_id: userId,
        },
        include: [{ model: User, attributes: ['username'] }]
      });

      if (!post) {
        return res.status(404).json({ message: 'No post found with this id or you are not authorized to edit it' });
      }

      await post.update(req.body);

      // Clear relevant caches
      await clearCaches(postId, userId, post.user.username);

      res.status(200).json({
        message: 'Post updated successfully!',
        post: post.get({ plain: true })
      });
    } catch (err) {
      console.error('Error updating post:', err);
      res.status(500).json({ message: 'Failed to update post', error: err.message });
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const userId = req.session.user_id;
      const postId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to delete a post' });
      }

      // Find the post to get the username and validate ownership
      const post = await Post.findOne({
        where: {
          id: postId,
          user_id: userId,
        },
        include: [{ model: User, attributes: ['username'] }]
      });

      if (!post) {
        return res.status(404).json({ message: 'No post found with this id or you are not authorized to delete it' });
      }

      // Delete the post
      await post.destroy();

      // Clear relevant caches
      await clearCaches(postId, userId, post.user.username, true);

      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ message: 'Failed to delete post', error: err.message });
    }
  }
};

module.exports = postController;