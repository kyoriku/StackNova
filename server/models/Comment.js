const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const { generateExcerpt } = require('../utils/excerptUtils');

class Comment extends Model { }

// Initialize Comment model with columns and configuration
// Includes comment text and relationships to users and posts
Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: 'post',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (comment) => {
        // Generate excerpt for new comments
        if (comment.comment_text) {
          comment.excerpt = generateExcerpt(comment.comment_text);
        }
      },
      beforeUpdate: async (comment) => {
        // Regenerate excerpt if comment_text has changed
        if (comment.changed('comment_text')) {
          comment.excerpt = generateExcerpt(comment.comment_text);
        }
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;