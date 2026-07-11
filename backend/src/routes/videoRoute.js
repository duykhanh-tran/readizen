import express from 'express';
import multer from 'multer';
import { 
  getTopics, 
  getTopicBySlug, 
  getLessonById, 
  getLessonBySlugs,
  createTopic, 
  updateTopic, 
  deleteTopic, 
  createLesson, 
  updateLesson, 
  deleteLesson, 
  uploadMedia 
} from '../controllers/videoController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer memory storage configuration for large uploads (up to 100MB for MP4 videos)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max size
});

// --- CLIENT PUBLIC/PROTECTED ROUTES ---
// Get all topics
router.get('/topics', verifyToken, getTopics);
// Get topic details and its lessons by slug
router.get('/topics/:slug', verifyToken, getTopicBySlug);
// Get specific lesson details by ID (for admin/general fetch)
router.get('/lesson/:id', verifyToken, getLessonById);
// Get specific lesson details by topicSlug and lessonSlug
router.get('/topics/:topicSlug/lessons/:lessonSlug', verifyToken, getLessonBySlugs);

// --- ADMIN ROUTES (Protected by verifyAdmin) ---
// Manage Topics
router.post('/admin/topics', verifyToken, verifyAdmin, createTopic);
router.put('/admin/topics/:id', verifyToken, verifyAdmin, updateTopic);
router.delete('/admin/topics/:id', verifyToken, verifyAdmin, deleteTopic);

// Manage Lessons
router.post('/admin/lessons', verifyToken, verifyAdmin, createLesson);
router.put('/admin/lessons/:id', verifyToken, verifyAdmin, updateLesson);
router.delete('/admin/lessons/:id', verifyToken, verifyAdmin, deleteLesson);

// Upload Media (handles MP4 videos or thumbnails)
router.post('/admin/upload', verifyToken, verifyAdmin, upload.single('file'), uploadMedia);

export default router;
