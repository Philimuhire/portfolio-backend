import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ServiceAttributes {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'icon' | 'createdAt' | 'updatedAt'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public icon!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
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
    icon: {
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
    tableName: 'services'
  }
);

export default Service;