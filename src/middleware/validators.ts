import { body } from 'express-validator';

export const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

export const projectValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('techStack').notEmpty().withMessage('Tech stack is required')
];

export const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

export const commentValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('comment').notEmpty().withMessage('Comment is required')
];

export const reactionValidation = [
  body('userEmail').isEmail().withMessage('Please include a valid email'),
  body('reaction').notEmpty().withMessage('Reaction is required')
];

export const messageValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

export const subscriberValidation = [
  body('email').isEmail().withMessage('Please include a valid email')
];

export const skillValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').isIn(['Frontend', 'Backend', 'DataAnalytics', 'SystemAdministration', 'Tool', 'SoftSkill']).withMessage('Invalid category'),
  body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be an integer between 0 and 100')
];

export const serviceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
];