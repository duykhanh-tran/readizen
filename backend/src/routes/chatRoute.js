import express from 'express';
import { getChatHistory, markMessagesAsRead, getChatUsers } from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', verifyToken, getChatUsers);          // Tránh xung đột với /:userId
router.get('/', verifyToken, getChatHistory);
router.get('/:userId', verifyToken, getChatHistory);
router.put('/read', verifyToken, markMessagesAsRead);
router.put('/:userId/read', verifyToken, markMessagesAsRead);

export default router;