import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Project from '../models/Project';
import Blog from '../models/Blog';
import BlogComment from '../models/BlogComment';
import Message from '../models/Message';
import Subscriber from '../models/Subscriber';
import Skill from '../models/Skill';
import Service from '../models/Service';
import { clearCache } from '../middleware/cacheMiddleware';

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectCount = await Project.count();
    const blogCount = await Blog.count();
    const commentCount = await BlogComment.count();
    const messageCount = await Message.count();
    const subscriberCount = await Subscriber.count();
    
    // Get recent messages
    const recentMessages = await Message.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get recent comments
    const recentComments = await BlogComment.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        { 
          model: Blog, 
          as: 'blog',
          attributes: ['id', 'title']
        }
      ]
    });
    
    res.json({
      counts: {
        projects: projectCount,
        blogs: blogCount,
        comments: commentCount,
        messages: messageCount,
        subscribers: subscriberCount
      },
      recentMessages,
      recentComments
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

// @desc    Clear API cache
// @route   POST /api/admin/clear-cache
// @access  Private/Admin
export const clearApiCache = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path } = req.body;
    
    if (path) {
      clearCache(`/api/${path}`);
    } else {
      clearCache();
    }
    
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ message: 'Server error clearing cache' });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get counts by category for skills
    const skillsByCategory = await Skill.findAll({
      attributes: [
        'category', 
        [Skill.sequelize!.fn('COUNT', '*'), 'count']
      ],
      group: ['category']
    });
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProjects = await Project.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    const recentBlogs = await Blog.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    const recentMessages = await Message.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    const recentSubscribers = await Subscriber.count({
      where: {
        subscribedAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    res.json({
      skillsByCategory,
      recentActivity: {
        projects: recentProjects,
        blogs: recentBlogs,
        messages: recentMessages,
        subscribers: recentSubscribers
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ message: 'Server error fetching system stats' });
  }
};

// @desc    Get content analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getContentAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get blog posts with comment counts
    const blogsWithComments = await Blog.findAll({
      attributes: [
        'id',
        'title',
        'postedDate',
        [Blog.sequelize!.fn('COUNT', Blog.sequelize!.col('comments.id')), 'commentCount']
      ],
      include: [
        {
          model: BlogComment,
          as: 'comments',
          attributes: []
        }
      ],
      group: ['Blog.id'],
      order: [['postedDate', 'DESC']],
      limit: 10
    });
    
    // Get most popular tags
    const allBlogs = await Blog.findAll({
      attributes: ['tags']
    });
    
    const tagCounts: Record<string, number> = {};
    allBlogs.forEach(blog => {
      blog.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    res.json({
      blogsWithComments,
      popularTags
    });
  } catch (error) {
    console.error('Get content analytics error:', error);
    res.status(500).json({ message: 'Server error fetching content analytics' });
  }
};