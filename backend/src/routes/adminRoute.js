import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy số liệu thống kê Dashboard Admin
router.get('/dashboard-stats', verifyToken, getDashboardStats);

export default router;
