import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define storage locations
const uploadDir = 'uploads/';
const projectsDir = path.join(uploadDir, 'projects/');
const blogsDir = path.join(uploadDir, 'blogs/');

// Create directories if they don't exist
[uploadDir, projectsDir, blogsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for projects
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for blogs
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `blog-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create upload instances
export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
}).single('image');

export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
}).single('image');