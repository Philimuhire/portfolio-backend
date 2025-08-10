import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SubscriberAttributes {
  id: string;
  email: string;
  subscribedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubscriberCreationAttributes
  extends Optional<SubscriberAttributes, 'id' | 'subscribedAt' | 'createdAt' | 'updatedAt'> {}

class Subscriber
  extends Model<SubscriberAttributes, SubscriberCreationAttributes>
  implements SubscriberAttributes {
  public id!: string;
  public email!: string;
  public subscribedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscriber.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    subscribedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    tableName: 'subscribers'
  }
);

export default Subscriber;
