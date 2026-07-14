import express from 'express';
import { 
    getAlphabetList, 
    getAlphabetLessonById, 
    saveAlphabetScore, 
    getMyAlphabetScores,
    getMyAlphabetAttempts,
    getAdminAlphabetList, 
    getAdminAlphabetById, 
    createAlphabetLesson, 
    updateAlphabetLesson, 
    deleteAlphabetLesson
} from '../controllers/alphabetController.js';
import { verifyToken, verifyAdmin, optionalVerifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Client routes
router.get('/', optionalVerifyToken, getAlphabetList);
router.get('/my/scores', verifyToken, getMyAlphabetScores);
router.get('/my/attempts', verifyToken, getMyAlphabetAttempts);
router.get('/:id', optionalVerifyToken, getAlphabetLessonById);
router.post('/score', verifyToken, saveAlphabetScore);

// Admin routes (all protected by verifyAdmin)
router.get('/admin/all', verifyAdmin, getAdminAlphabetList);
router.get('/admin/:id', verifyAdmin, getAdminAlphabetById);
router.post('/admin', verifyAdmin, createAlphabetLesson);
router.put('/admin/:id', verifyAdmin, updateAlphabetLesson);
router.delete('/admin/:id', verifyAdmin, deleteAlphabetLesson);

export default router;
