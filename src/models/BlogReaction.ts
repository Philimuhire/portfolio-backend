import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Blog from './Blog';

interface BlogReactionAttributes {
  id: string;
  blogId: string;
  userEmail: string;
  reaction: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogReactionCreationAttributes extends Optional<BlogReactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BlogReaction extends Model<BlogReactionAttributes, BlogReactionCreationAttributes> implements BlogReactionAttributes {
  public id!: string;
  public blogId!: string;
  public userEmail!: string;
  public reaction!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BlogReaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    blogId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'id'
      }
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    reaction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'blog_reactions'
  }
);

export default BlogReaction;