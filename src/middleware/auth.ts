import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if auth header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');

      // Get user from the token (exclude password)
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      // Set user in request
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.email === 'philimuhire@gmail.com') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};