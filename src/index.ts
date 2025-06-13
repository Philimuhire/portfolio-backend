import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sequelize } from './models';
import { cacheMiddleware } from './middleware/cacheMiddleware';

// Import routes
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import blogRoutes from './routes/blogRoutes';
import messageRoutes from './routes/messageRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import skillRoutes from './routes/skillRoutes';
import serviceRoutes from './routes/serviceRoutes';
import uploadRoutes from './routes/uploadRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';

// Initialize config
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));

// Cache API responses
app.use('/api', cacheMiddleware());

// Static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Portfolio API' });
});

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database models (use { force: true } only in development to recreate tables)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();