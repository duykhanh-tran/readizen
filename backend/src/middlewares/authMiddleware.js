import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/BlacklistedToken.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối. Không tìm thấy Token!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Truy cập bị từ chối. Bạn không có quyền quản trị.' });
        }
        next();
    });
};

export const optionalVerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }
};

export const verifyRefreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Không tìm thấy Refresh Token.' });
        }

        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            res.clearCookie("refreshToken");
            return res.status(403).json({ message: 'Refresh Token đã bị vô hiệu hóa (Blacklisted).' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};