import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public techStack!: string[];
  public githubLink!: string;
  public liveLink!: string;
  public imageUrl!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    techStack: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    githubLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    liveLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'projects'
  }
);

export default Project;