import express from 'express';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService
} from '../controllers/serviceController';
import { protect, admin } from '../middleware/auth';
import { serviceValidation } from '../middleware/validators';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, admin, serviceValidation, createService);

router.route('/:id')
  .put(protect, admin, serviceValidation, updateService)
  .delete(protect, admin, deleteService);

export default router;