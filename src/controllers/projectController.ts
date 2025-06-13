import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { title, description, techStack, githubLink, liveLink, imageUrl } = req.body;
    
    const project = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map((tech: string) => tech.trim()),
      githubLink,
      liveLink,
      imageUrl
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const project = await Project.findByPk(req.params.id);
    
    if (project) {
      const { title, description, techStack, githubLink, liveLink, imageUrl } = req.body;
      
      project.title = title || project.title;
      project.description = description || project.description;
      
      if (techStack) {
        project.techStack = Array.isArray(techStack) 
          ? techStack 
          : techStack.split(',').map((tech: string) => tech.trim());
      }
      
      project.githubLink = githubLink || project.githubLink;
      project.liveLink = liveLink || project.liveLink;
      project.imageUrl = imageUrl || project.imageUrl;
      
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (project) {
      await project.destroy();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};