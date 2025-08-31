const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  // Method to validate password during login (only for local users)
  checkPassword(loginPw) {
    if (!this.password) return false; // OAuth users don't have passwords
    return bcrypt.compareSync(loginPw, this.password);
  }

  // Check if user is OAuth user
  isOAuthUser() {
    return this.auth_provider && this.auth_provider !== 'local';
  }
}

// Initialize User model with columns and configuration
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Changed to allow null for OAuth users
      validate: {
        len: {
          args: [8],
          msg: "Password must be at least 8 characters long"
        },
        is: {
          args: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
          msg: "Password must contain at least one letter and one number"
        },
        // Custom validation to ensure local users have passwords
        localUserPassword(value) {
          if (this.auth_provider === 'local' && !value) {
            throw new Error('Password is required for local authentication');
          }
        }
      },
    },
    // New OAuth fields
    auth_provider: {
      type: DataTypes.ENUM('local', 'google'),
      defaultValue: 'local',
      allowNull: false,
    },
    oauth_id: {
      type: DataTypes.STRING,
      allowNull: true, // Google user ID
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true, // Profile picture from OAuth provider
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: true, // Full name from OAuth provider
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        // Only hash password for local users
        if (newUserData.auth_provider === 'local' && newUserData.password) {
          newUserData.password = await bcrypt.hash(newUserData.password, 12);
        }
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        // Only hash password for local users if password is being updated
        if (updatedUserData.auth_provider === 'local' && updatedUserData.password && updatedUserData.changed('password')) {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 12);
        }
        return updatedUserData;
      },
    },
    // Add unique constraint for OAuth users
    indexes: [
      {
        unique: true,
        fields: ['oauth_id', 'auth_provider'],
        where: {
          auth_provider: { [Op.ne]: 'local' }
        }
      }
    ],
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;