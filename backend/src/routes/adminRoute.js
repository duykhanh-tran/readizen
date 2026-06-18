import express from 'express';
import multer from 'multer';
import { getDashboardStats } from '../controllers/adminController.js';
import { createLesson, getAdminLessons, updateLesson, deleteLesson, getAdminLessonById } from '../controllers/lessonController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { lessonValidationRules } from '../middlewares/validationMiddleware.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

const router = express.Router();

// Multer memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
});

// Middleware giải mã mảng ebookImages và practiceSentences dạng JSON String từ FormData gửi lên
const parseMultipartLessonBody = (req, res, next) => {
  if (req.body.ebookImages && typeof req.body.ebookImages === 'string') {
    try {
      req.body.ebookImages = JSON.parse(req.body.ebookImages);
    } catch (e) {
      console.error('Failed to parse JSON string in ebookImages body:', e);
    }
  }
  if (req.body.practiceSentences && typeof req.body.practiceSentences === 'string') {
    try {
      req.body.practiceSentences = JSON.parse(req.body.practiceSentences);
    } catch (e) {
      console.error('Failed to parse JSON string in practiceSentences body:', e);
    }
  }
  next();
};

// Lấy số liệu thống kê Dashboard Admin
router.get('/dashboard-stats', verifyAdmin, getDashboardStats);

// Quản lý bài học AI (Nhận FormData thông qua upload.none() và parse body)
router.post('/lessons', verifyAdmin, upload.none(), parseMultipartLessonBody, lessonValidationRules, createLesson);
router.get('/lessons', verifyAdmin, getAdminLessons);
router.get('/lessons/:id', verifyAdmin, getAdminLessonById);
router.put('/lessons/:id', verifyAdmin, upload.none(), parseMultipartLessonBody, lessonValidationRules, updateLesson);
router.delete('/lessons/:id', verifyAdmin, deleteLesson);

// Upload File (Ảnh/PDF) lên Cloudinary
router.post('/upload', verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file tải lên.' });
    }
    
    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf');
    const folder = isPdf ? 'readizen/docs' : 'readizen/images';

    const fileUrl = await uploadToCloudinary(
      req.file.buffer, 
      req.file.originalname, 
      req.file.mimetype, 
      folder
    );
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('❌ [Upload Route Error Details]:', error);
    if (error && error.message) {
      console.error('❌ Message:', error.message);
    }
    res.status(500).json({ 
      message: 'Không thể tải file lên hệ thống lưu trữ.', 
      error: error?.message || error 
    });
  }
});

export default router;
