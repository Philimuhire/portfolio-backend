import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Message from '../models/Message';
import nodemailer from 'nodemailer';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, subject, message } = req.body;
    
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587', 10),
          secure: process.env.EMAIL_PORT === '465',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, 
          subject: `New Contact: ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>`
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error creating message' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};