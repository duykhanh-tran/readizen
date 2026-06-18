import express from 'express';
import { createUserScore, getUserScores } from '../controllers/lessonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { userScoreValidationRules } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Lưu điểm số học tập và lấy lịch sử điểm số của học sinh
router.post('/scores', verifyToken, userScoreValidationRules, createUserScore);
router.get('/my-scores', verifyToken, getUserScores);

export default router;
