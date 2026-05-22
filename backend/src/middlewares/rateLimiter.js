import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    limit: 30, // Giới hạn 30 requests mỗi 15 phút cho mỗi IP
    standardHeaders: 'draft-7', // Trả về thông tin giới hạn trong header chuẩn
    legacyHeaders: false, // Tắt header X-RateLimit-* cũ
    message: {
        message: 'Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau 15 phút.'
    }
});
