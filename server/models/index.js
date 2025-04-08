const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Define model associations
// Sets up relationships between User, Post, and Comment models
// Includes cascade deletion for comments when posts are deleted

// User associations
User.hasMany(Post, {
  foreignKey: 'user_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
});

// Post associations
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

// Comment associations
Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
});

module.exports = { User, Post, Comment };