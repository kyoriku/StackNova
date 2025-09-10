const { Post, User, Comment } = require('../models');
const { generateUniqueSlug } = require('../utils/slugUtils');
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
    // Clear cache for both post ID and slug (same logic as comment controller)
    const post = await Post.findByPk(postId, { attributes: ['id', 'slug'] });
    if (post) {
      cacheOps.push(redisService.clearPostCache(post.id, includeComments)); // UUID version
      cacheOps.push(redisService.clearPostCache(post.slug, includeComments)); // Slug version
    } else {
      // Fallback: just clear by ID if post not found
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

  // Get a single post by slug or ID (for backward compatibility)
  // async getSinglePost(req, res) {
  //   try {
  //     const identifier = req.params.identifier;
  //     let whereClause;

  //     // Determine if the identifier is a UUID (old URL format) or a slug
  //     if (isUUID(identifier)) {
  //       whereClause = { id: identifier };
  //     } else {
  //       whereClause = { slug: identifier };
  //     }

  //     const postData = await Post.findOne({
  //       where: whereClause,
  //       ...postQueryOptions
  //     });

  //     if (!postData) {
  //       return res.status(404).json({ message: 'No post found with this identifier!' });
  //     }

  //     // If accessed by ID, redirect to the clean URL
  //     if (isUUID(identifier)) {
  //       return res.redirect(301, `/post/${postData.slug}`);
  //     }

  //     res.json(postData.get({ plain: true }));
  //   } catch (err) {
  //     console.error(`Error fetching post ${req.params.identifier}:`, err);
  //     res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  //   }
  // },

  // Return data for both UUID and slug
  // async getSinglePost(req, res) {
  //   try {
  //     const identifier = req.params.identifier;
  //     let whereClause;

  //     // Determine if the identifier is a UUID or a slug
  //     if (isUUID(identifier)) {
  //       whereClause = { id: identifier };
  //     } else {
  //       whereClause = { slug: identifier };
  //     }

  //     const postData = await Post.findOne({
  //       where: whereClause,
  //       ...postQueryOptions
  //     });

  //     if (!postData) {
  //       return res.status(404).json({ message: 'No post found with this identifier!' });
  //     }

  //     // Just return the data - let frontend handle URL updates
  //     res.json(postData.get({ plain: true }));
  //   } catch (err) {
  //     console.error(`Error fetching post ${req.params.identifier}:`, err);
  //     res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  //   }
  // },

  async getSinglePost(req, res) {
    try {
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
        return res.status(404).json({ message: 'No post found with this identifier!' });
      }

      // Handle UUID requests for SEO
      if (isUUID(identifier)) {
        // Check if this is a direct browser request vs API call
        const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
        const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
        const userAgent = req.headers['user-agent'] || '';

        // Browser navigation (for SEO): Has HTML accept header and user agent, but doesn't explicitly request JSON
        const isBrowserNavigation = acceptsHtml && userAgent && !acceptsJson;

        // API call from React: Explicitly accepts JSON or has XMLHttpRequest header
        const isApiCall = acceptsJson || req.headers['x-requested-with'] === 'XMLHttpRequest';

        if (isBrowserNavigation) {
          // SEO-friendly 301 redirect for search engines and direct browser access
          return res.redirect(301, `/post/${postData.slug}`);
        } else {
          // API call - return JSON data for React to handle client-side
          return res.json(postData.get({ plain: true }));
        }
      }

      // Normal slug request - return JSON
      res.json(postData.get({ plain: true }));
    } catch (err) {
      console.error(`Error fetching post ${req.params.identifier}:`, err);
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

      const user = await User.findByPk(userId, {
        attributes: ['username']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
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
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(400).json({ message: 'Failed to create post', error: err.message });
    }
  },

  async updatePost(req, res) {
    try {
      const userId = req.session.user_id;
      const identifier = req.params.identifier;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to update a post' });
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
        return res.status(404).json({ message: 'No post found with this identifier or you are not authorized to edit it' });
      }

      // If title is changing, generate new slug
      const updateData = { ...req.body };
      if (req.body.title && req.body.title !== post.title) {
        updateData.slug = await generateUniqueSlug(req.body.title, post.id);
      }

      await post.update(updateData);

      // Clear relevant caches BEFORE sending response
      await clearCaches(post.id, userId, post.user.username);

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
      const identifier = req.params.identifier;

      if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to delete a post' });
      }

      // Determine if the identifier is a UUID or slug
      let whereClause = { user_id: userId };
      if (isUUID(identifier)) {
        whereClause.id = identifier;
      } else {
        whereClause.slug = identifier;
      }

      // Find the post to get the username and validate ownership
      const post = await Post.findOne({
        where: whereClause,
        include: [{ model: User, attributes: ['username'] }]
      });

      if (!post) {
        return res.status(404).json({ message: 'No post found with this identifier or you are not authorized to delete it' });
      }

      // Delete the post
      await post.destroy();

      // Clear relevant caches BEFORE sending response
      await clearCaches(post.id, userId, post.user.username, true);

      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ message: 'Failed to delete post', error: err.message });
    }
  }
};

module.exports = postController;