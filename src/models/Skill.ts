import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SkillAttributes {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DataAnalytics'| 'SystemAdministration'| 'Tool' | 'SoftSkill';
  percentage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SkillCreationAttributes extends Optional<SkillAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: string;
  public name!: string;
  public category!: 'Frontend' | 'Backend' | 'DataAnalytics'| 'SystemAdministration'| 'Tool' | 'SoftSkill';
  public percentage!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Skill.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Frontend', 'Backend', 'Tool', 'SoftSkill'),
      allowNull: false
    },
    percentage: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
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
    tableName: 'skills'
  }
);

export default Skill;