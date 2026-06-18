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

export const speechLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    limit: 10, // Giới hạn 10 requests mỗi phút cho mỗi IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        message: 'Bạn đang thực hiện thao tác quá nhanh. Vui lòng thử lại sau 1 phút.'
    }
});
