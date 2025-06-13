import { Op } from 'sequelize';
import Project from '../models/Project';
import Blog from '../models/Blog';
import BlogComment from '../models/BlogComment';
import BlogReaction from '../models/BlogReaction';

export const searchProjects = async (query: string) => {
  return await Project.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { techStack: { [Op.contains]: [query] } }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
};

export const searchBlogs = async (query: string) => {
  return await Blog.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { content: { [Op.iLike]: `%${query}%` } },
        { tags: { [Op.contains]: [query] } }
      ]
    },
    include: [
      { 
        model: BlogComment, 
        as: 'comments',
        limit: 5,
        order: [['createdAt', 'DESC']]
      },
      {
        model: BlogReaction,
        as: 'reactions'
      }
    ],
    order: [['postedDate', 'DESC']]
  });
};

// Advanced search with filters for projects
export const advancedProjectSearch = async (query: string, techStack?: string[]) => {
  const whereConditions: any = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${query}%` } },
      { description: { [Op.iLike]: `%${query}%` } }
    ]
  };

  // If techStack filter is provided, add it to where conditions
  if (techStack && techStack.length > 0) {
    whereConditions.techStack = {
      [Op.overlap]: techStack
    };
  }

  return await Project.findAll({
    where: whereConditions,
    order: [['createdAt', 'DESC']]
  });
};

// Advanced search with filters for blogs
export const advancedBlogSearch = async (query: string, tags?: string[], dateFrom?: Date, dateTo?: Date) => {
  const whereConditions: any = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${query}%` } },
      { content: { [Op.iLike]: `%${query}%` } }
    ]
  };

  // If tags filter is provided, add it to where conditions
  if (tags && tags.length > 0) {
    whereConditions.tags = {
      [Op.overlap]: tags
    };
  }

  // If date range is provided, add it to where conditions
  if (dateFrom || dateTo) {
    whereConditions.postedDate = {};
    if (dateFrom) {
      whereConditions.postedDate[Op.gte] = dateFrom;
    }
    if (dateTo) {
      whereConditions.postedDate[Op.lte] = dateTo;
    }
  }

  return await Blog.findAll({
    where: whereConditions,
    include: [
      { 
        model: BlogComment, 
        as: 'comments',
        limit: 5,
        order: [['createdAt', 'DESC']]
      },
      {
        model: BlogReaction,
        as: 'reactions'
      }
    ],
    order: [['postedDate', 'DESC']]
  });
};