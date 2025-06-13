import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlogAttributes {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  postedDate: Date;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogCreationAttributes extends Optional<BlogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  public id!: string;
  public title!: string;
  public content!: string;
  public coverImage!: string;
  public postedDate!: Date;
  public tags!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Blog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
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
    tableName: 'blogs'
  }
);

export default Blog;