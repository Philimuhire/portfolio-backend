import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Subscriber from '../models/Subscriber';

// @desc    Add a new subscriber
// @route   POST /api/subscribe
// @access  Public
export const addSubscriber = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, name } = req.body;
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ where: { email } });
    
    if (existingSubscriber) {
      res.status(400).json({ message: 'Email already subscribed' });
      return;
    }
    
    const subscriber = await Subscriber.create({
      email,
      name,
      subscribedAt: new Date()
    });

    res.status(201).json(subscriber);
  } catch (error) {
    console.error('Add subscriber error:', error);
    res.status(500).json({ message: 'Server error adding subscriber' });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
export const getSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await Subscriber.findAll({
      order: [['subscribedAt', 'DESC']]
    });
    
    res.json(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ message: 'Server error fetching subscribers' });
  }
};