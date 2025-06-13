import { Request, Response } from 'express';
import { 
  searchProjects, 
  searchBlogs, 
  advancedProjectSearch,
  advancedBlogSearch
} from '../utils/searchUtils';

// @desc    Search projects and blogs
// @route   GET /api/search
// @access  Public
export const search = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  
  if (!query) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }
  
  try {
    const projects = await searchProjects(query);
    const blogs = await searchBlogs(query);
    
    res.json({
      projects,
      blogs,
      total: projects.length + blogs.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};

// @desc    Search projects only
// @route   GET /api/search/projects
// @access  Public
export const searchProjectsOnly = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  
  if (!query) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }
  
  try {
    const projects = await searchProjects(query);
    
    res.json({
      projects,
      total: projects.length
    });
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({ message: 'Server error during project search' });
  }
};

// @desc    Search blogs only
// @route   GET /api/search/blogs
// @access  Public
export const searchBlogsOnly = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  
  if (!query) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }
  
  try {
    const blogs = await searchBlogs(query);
    
    res.json({
      blogs,
      total: blogs.length
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({ message: 'Server error during blog search' });
  }
};

// @desc    Advanced search for projects
// @route   GET /api/search/projects/advanced
// @access  Public
export const advancedSearchProjects = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  const techStackParam = req.query.techStack as string;
  
  if (!query) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }
  
  try {
    let techStack: string[] | undefined;
    
    if (techStackParam) {
      techStack = Array.isArray(techStackParam) 
        ? techStackParam 
        : techStackParam.split(',').map(tech => tech.trim());
    }
    
    const projects = await advancedProjectSearch(query, techStack);
    
    res.json({
      projects,
      total: projects.length,
      filters: {
        query,
        techStack: techStack || []
      }
    });
  } catch (error) {
    console.error('Advanced project search error:', error);
    res.status(500).json({ message: 'Server error during advanced project search' });
  }
};

// @desc    Advanced search for blogs
// @route   GET /api/search/blogs/advanced
// @access  Public
export const advancedSearchBlogs = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  const tagsParam = req.query.tags as string;
  const dateFromParam = req.query.dateFrom as string;
  const dateToParam = req.query.dateTo as string;
  
  if (!query) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }
  
  try {
    let tags: string[] | undefined;
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;
    
    if (tagsParam) {
      tags = Array.isArray(tagsParam) 
        ? tagsParam 
        : tagsParam.split(',').map(tag => tag.trim());
    }
    
    if (dateFromParam) {
      dateFrom = new Date(dateFromParam);
      if (isNaN(dateFrom.getTime())) {
        res.status(400).json({ message: 'Invalid dateFrom format' });
        return;
      }
    }
    
    if (dateToParam) {
      dateTo = new Date(dateToParam);
      if (isNaN(dateTo.getTime())) {
        res.status(400).json({ message: 'Invalid dateTo format' });
        return;
      }
    }
    
    const blogs = await advancedBlogSearch(query, tags, dateFrom, dateTo);
    
    res.json({
      blogs,
      total: blogs.length,
      filters: {
        query,
        tags: tags || [],
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      }
    });
  } catch (error) {
    console.error('Advanced blog search error:', error);
    res.status(500).json({ message: 'Server error during advanced blog search' });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  
  if (!query || query.length < 2) {
    res.json({ suggestions: [] });
    return;
  }
  
  try {
    // Get project titles that match
    const projects = await searchProjects(query);
    const projectSuggestions = projects.slice(0, 3).map(project => ({
      type: 'project',
      title: project.title,
      id: project.id
    }));
    
    // Get blog titles that match
    const blogs = await searchBlogs(query);
    const blogSuggestions = blogs.slice(0, 3).map(blog => ({
      type: 'blog',
      title: blog.title,
      id: blog.id
    }));
    
    const suggestions = [...projectSuggestions, ...blogSuggestions];
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error getting search suggestions' });
  }
};

// @desc    Get popular search terms
// @route   GET /api/search/popular
// @access  Public
export const getPopularSearchTerms = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you would track search queries in a database
    // For now, we'll return some static popular terms based on your content
    const popularTerms = [
      'JavaScript',
      'React',
      'Node.js',
      'TypeScript',
      'Web Development',
      'Frontend',
      'Backend',
      'API',
      'Database',
      'Programming'
    ];
    
    res.json({ popularTerms });
  } catch (error) {
    console.error('Popular search terms error:', error);
    res.status(500).json({ message: 'Server error getting popular search terms' });
  }
};