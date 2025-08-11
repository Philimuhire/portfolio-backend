import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Blog from '../models/Blog';
import BlogComment from '../models/BlogComment';
import BlogReaction from '../models/BlogReaction';

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: BlogComment, as: 'comments' },
        { model: BlogReaction, as: 'reactions' }
      ]
    });
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        { model: BlogComment, as: 'comments' },
        { model: BlogReaction, as: 'reactions' }
      ]
    });
    
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error fetching blog' });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { title, content, tags } = req.body;

    const coverImage = req.file ? (req.file as any).path : null;

    const blog = await Blog.create({
      title,
      content,
      coverImage,
      postedDate: new Date(),
      tags: Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag: string) => tag.trim()),
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error creating blog' });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const blog = await Blog.findByPk(req.params.id);
    
    if (blog) {
      const { title, content, coverImage, tags } = req.body;
      
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.coverImage = coverImage || blog.coverImage;
      
      if (tags) {
        blog.tags = Array.isArray(tags) 
          ? tags 
          : tags.split(',').map((tag: string) => tag.trim());
      }
      
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error updating blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    
    if (blog) {
      await blog.destroy();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error deleting blog' });
  }
};

export const addBlogComment = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const blog = await Blog.findByPk(req.params.id);
    
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    
    const { name, email, comment } = req.body;
    
    const blogComment = await BlogComment.create({
      blogId: blog.id,
      name,
      email,
      comment
    });

    res.status(201).json(blogComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

export const getBlogComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await BlogComment.findAll({
      where: { blogId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
};

export const addBlogReaction = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const blog = await Blog.findByPk(req.params.id);
    
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    
    const { userEmail, reaction } = req.body;
    
    const existingReaction = await BlogReaction.findOne({
      where: { blogId: blog.id, userEmail }
    });
    
    if (existingReaction) {
      existingReaction.reaction = reaction;
      await existingReaction.save();
      res.json(existingReaction);
      return;
    }
    
    const blogReaction = await BlogReaction.create({
      blogId: blog.id,
      userEmail,
      reaction
    });

    res.status(201).json(blogReaction);
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Server error adding reaction' });
  }
};

export const getBlogReactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const reactions = await BlogReaction.findAll({
      where: { blogId: req.params.id }
    });
    
    res.json(reactions);
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({ message: 'Server error fetching reactions' });
  }
};