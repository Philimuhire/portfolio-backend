import express from 'express';
import { addSubscriber, getSubscribers } from '../controllers/subscriberController';
import { protect, admin } from '../middleware/auth';
import { subscriberValidation } from '../middleware/validators';

const router = express.Router();

router.post('/', subscriberValidation, addSubscriber);
router.get('/', protect, admin, getSubscribers);

export default router;