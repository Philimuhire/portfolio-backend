import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Skill from '../models/Skill';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await Skill.findAll({
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error fetching skills' });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, category, level } = req.body;
    
    const skill = await Skill.create({
      name,
      category,
      level
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Server error creating skill' });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const skill = await Skill.findByPk(req.params.id);
    
    if (skill) {
      const { name, category, level } = req.body;
      
      skill.name = name || skill.name;
      skill.category = category || skill.category;
      skill.level = level || skill.level;
      
      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error updating skill' });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    
    if (skill) {
      await skill.destroy();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error deleting skill' });
  }
};