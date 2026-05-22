import User from '../models/User.js';
import Form from '../models/Form.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Kiểm tra nghiêm ngặt quyền hạn dựa trên role trong Token
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        const totalUsers = await User.countDocuments();
        const totalForms = await Form.countDocuments();
        const pendingForms = await Form.countDocuments({ status: 'pending' });
        const contactedForms = await Form.countDocuments({ status: 'contacted' });
        const canceledForms = await Form.countDocuments({ status: 'canceled' });

        res.status(200).json({
            totalUsers,
            totalForms,
            pendingForms,
            contactedForms,
            canceledForms
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
