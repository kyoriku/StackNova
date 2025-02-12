// Import required dependencies
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const { generateExcerpt } = require('../utils/excerptUtils');

class Post extends Model {
  // You can add any custom instance methods here if needed
}

// Initialize Post model with columns and configuration
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (post) => {
        // Generate excerpt for new posts
        if (post.content) {
          post.excerpt = generateExcerpt(post.content);
        }
      },
      beforeUpdate: async (post) => {
        // Regenerate excerpt if content has changed
        if (post.changed('content')) {
          post.excerpt = generateExcerpt(post.content);
        }
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'post',
  }
);

module.exports = Post;