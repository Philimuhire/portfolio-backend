import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import Blog from './Blog';
import BlogComment from './BlogComment';
import BlogReaction from './BlogReaction';
import Message from './Message';
import Subscriber from './Subscriber';
import Skill from './Skill';
import Service from './Service';

const models = {
  User,
  Project,
  Blog,
  BlogComment,
  BlogReaction,
  Message,
  Subscriber,
  Skill,
  Service
};

// Define all associations here to avoid circular dependencies
Blog.hasMany(BlogComment, { foreignKey: 'blogId', as: 'comments' });
BlogComment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

Blog.hasMany(BlogReaction, { foreignKey: 'blogId', as: 'reactions' });
BlogReaction.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

export { sequelize };
export default models;