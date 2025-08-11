import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/';
const projectsDir = path.join(uploadDir, 'projects/');
const blogsDir = path.join(uploadDir, 'blogs/');

[uploadDir, projectsDir, blogsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `blog-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter
}).single('image');

export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
}).single('image');