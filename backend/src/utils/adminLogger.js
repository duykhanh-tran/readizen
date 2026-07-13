import AdminActivityLog from '../models/AdminActivityLog.js';
import { getIO } from './socketIO.js';

export const logAdminActivity = async (adminId, actionType, module, details) => {
    try {
        if (!adminId) {
            console.error('Cannot log admin activity: adminId is required');
            return null;
        }

        const log = new AdminActivityLog({
            adminId,
            actionType,
            module,
            details
        });

        await log.save();
        
        // Populate the log with admin details (e.g. username)
        const populatedLog = await log.populate('adminId', 'username');

        // Phát tín hiệu Socket.io tới các Admin đang kết nối
        const io = getIO();
        if (io) {
            io.emit('new_admin_activity', populatedLog);
        }

        return populatedLog;
    } catch (error) {
        console.error('Lỗi khi ghi nhật ký hoạt động Admin:', error);
        return null;
    }
};
