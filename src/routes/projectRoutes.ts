import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';
import { protect, admin } from '../middleware/auth';
import { projectValidation } from '../middleware/validators';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, admin, upload.single('imageUrl'), projectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, admin, upload.single('imageUrl'), projectValidation, updateProject)
  .delete(protect, admin, deleteProject);

export default router;