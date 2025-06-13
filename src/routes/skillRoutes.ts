import express from 'express';
import { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../controllers/skillController';
import { protect, admin } from '../middleware/auth';
import { skillValidation } from '../middleware/validators';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, admin, skillValidation, createSkill);

router.route('/:id')
  .put(protect, admin, skillValidation, updateSkill)
  .delete(protect, admin, deleteSkill);

export default router;