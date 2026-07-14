import express from 'express';
import { getChatHistory, markMessagesAsRead, getChatUsers, registerGuestChat } from '../controllers/chatController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/guest', registerGuestChat);
router.get('/users', verifyAdmin, getChatUsers);          // Tránh xung đột với /:userId
router.get('/', verifyToken, getChatHistory);
router.get('/:userId', verifyToken, getChatHistory);
router.put('/read', verifyToken, markMessagesAsRead);
router.put('/:userId/read', verifyToken, markMessagesAsRead);

export default router;