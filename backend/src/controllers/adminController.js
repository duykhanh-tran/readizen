import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import AdminActivityLog from '../models/AdminActivityLog.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Kiểm tra nghiêm ngặt quyền hạn dựa trên role trong Token
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        // Truy vấn đếm song song các bảng dữ liệu bằng Promise.all để tăng tốc hiệu năng
        const [totalUsers, totalReadingLessons, totalAlphabetLessons, totalVideoLessons] = await Promise.all([
            User.countDocuments(),
            Lesson.countDocuments(),
            AlphabetLesson.countDocuments(),
            VideoLesson.countDocuments()
        ]);

        res.status(200).json({
            totalUsers,
            totalReadingLessons,
            totalAlphabetLessons,
            totalVideoLessons
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách nhật ký hoạt động hệ thống (Admin-only)
export const getActivityLogs = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        const logs = await AdminActivityLog.find()
            .populate('adminId', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
