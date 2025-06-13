import express from 'express';
import { 
  getDashboardData, 
  clearApiCache, 
  getSystemStats, 
  getContentAnalytics 
} from '../controllers/adminController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardData);
router.get('/stats', protect, admin, getSystemStats);
router.get('/analytics', protect, admin, getContentAnalytics);
router.post('/clear-cache', protect, admin, clearApiCache);

export default router;