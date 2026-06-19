import express from 'express';
import multer from 'multer';
import { getClientLessons, getClientLessonById, evaluateAudioSpeech } from '../controllers/lessonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { speechLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit (chống spam RAM/OOM)
});

// Lấy danh sách bài học đang hoạt động và chi tiết bài học (Công khai cho mọi người dùng)
router.get('/', getClientLessons);
router.get('/:id', getClientLessonById);

// Chấm điểm phát âm AI cho học viên (áp dụng giới hạn lượt gọi 10 lần/phút, công khai cho khách)
router.post('/evaluate-audio', speechLimiter, upload.single('audio'), evaluateAudioSpeech);

export default router;
