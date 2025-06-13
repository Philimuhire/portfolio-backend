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

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, admin, projectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, admin, projectValidation, updateProject)
  .delete(protect, admin, deleteProject);

export default router;