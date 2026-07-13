import express from 'express';
import { register, login, adminLogin, getMe, logout, refreshToken, updatePassword, updateAvatar, getSession } from '../controllers/authController.js';
import { verifyToken, verifyRefreshToken } from '../middlewares/authMiddleware.js';
import { registerValidationRules, loginValidationRules, adminLoginValidationRules } from '../middlewares/validationMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Áp dụng giới hạn rate-limit cho toàn bộ các endpoint xác thực
router.use(authLimiter);

router.post('/register', registerValidationRules, register);
router.post('/login', loginValidationRules, login);
router.post('/refresh', verifyRefreshToken, refreshToken);
router.post('/admin/login', adminLoginValidationRules, adminLogin);
router.post('/logout', logout);
router.get('/session', getSession);
router.get('/me', verifyToken, getMe);

// Thêm API cho User Portal (Yêu cầu đăng nhập trước)
router.put('/password', verifyToken, updatePassword);
router.put('/avatar', verifyToken, updateAvatar);

export default router;