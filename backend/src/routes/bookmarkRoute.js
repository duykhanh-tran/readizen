import express from 'express';
import { toggleBookmark, getMyBookmarks, getBookmarkStatus } from '../controllers/bookmarkController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/toggle', verifyToken, toggleBookmark);
router.get('/my', verifyToken, getMyBookmarks);
router.get('/status', verifyToken, getBookmarkStatus);

export default router;
