import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Blog from './Blog';

interface BlogCommentAttributes {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogCommentCreationAttributes extends Optional<BlogCommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BlogComment extends Model<BlogCommentAttributes, BlogCommentCreationAttributes> implements BlogCommentAttributes {
  public id!: string;
  public blogId!: string;
  public name!: string;
  public email!: string;
  public comment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BlogComment.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
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
    tableName: 'blog_comments'
  }
);

export default BlogComment;