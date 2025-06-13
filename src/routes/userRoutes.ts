import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { userValidation, loginValidation } from '../middleware/validators';

const router = express.Router();

router.post('/', userValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, userValidation, updateUserProfile);

export default router;