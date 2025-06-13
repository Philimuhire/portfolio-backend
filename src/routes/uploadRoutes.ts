import express from 'express';
import path from 'path';
import { protect, admin } from '../middleware/auth';
import { uploadProjectImage, uploadBlogImage } from '../middleware/uploadMiddleware';

const router = express.Router();

// Upload project image
router.post('/projects', protect, admin, (req, res) => {
  uploadProjectImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = `/uploads/projects/${req.file.filename}`;
    res.status(200).json({ filePath });
  });
});

// Upload blog image
router.post('/blogs', protect, admin, (req, res) => {
  uploadBlogImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = `/uploads/blogs/${req.file.filename}`;
    res.status(200).json({ filePath });
  });
});

export default router;