import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Subscriber from '../models/Subscriber';
import nodemailer from 'nodemailer';

export const addSubscriber = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email } = req.body;

    const existingSubscriber = await Subscriber.findOne({ where: { email } });
    if (existingSubscriber) {
      res.status(400).json({ message: 'Email already subscribed' });
      return;
    }

    const subscriber = await Subscriber.create({
      email,
      subscribedAt: new Date()
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Subscriptions" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: 'New Portfolio Subscriber',
      html: `
        <h2>New Subscriber!</h2>
        <p><strong>Email:</strong> ${subscriber.email}</p>
        <p><strong>Subscribed At:</strong> ${subscriber.subscribedAt}</p>
      `
    });

    res.status(201).json(subscriber);
  } catch (error) {
    console.error('Add subscriber error:', error);
    res.status(500).json({ message: 'Server error adding subscriber' });
  }
};

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