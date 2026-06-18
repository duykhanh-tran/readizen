import express from 'express';
import multer from 'multer';
import { getClientLessons, getClientLessonById, evaluateAudioSpeech } from '../controllers/lessonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Lấy danh sách bài học đang hoạt động và chi tiết bài học
router.get('/', verifyToken, getClientLessons);
router.get('/:id', verifyToken, getClientLessonById);

// Chấm điểm phát âm AI cho học viên
router.post('/evaluate-audio', verifyToken, upload.single('audio'), evaluateAudioSpeech);

export default router;
