import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController';
import { protect, admin } from '../middleware/auth';
import { messageValidation } from '../middleware/validators';

const router = express.Router();

router.route('/')
  .post(messageValidation, createMessage)
  .get(protect, admin, getMessages);

export default router;