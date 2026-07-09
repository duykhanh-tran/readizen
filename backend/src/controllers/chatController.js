import Message from '../models/Message.js';
import User from '../models/User.js';

export const getChatHistory = async (req, res) => {
    try {
        // Nếu là Admin, lấy userId từ URL params (ví dụ: /api/chat/12345)
        // Nếu là User, tự động lấy userId của chính họ từ Token
        const targetUserId = req.user.role === 'admin' ? req.params.userId : req.user.id;

        if (!targetUserId) {
            return res.status(400).json({ message: "Thiếu ID người dùng." });
        }

        // Lấy toàn bộ tin nhắn thuộc về User này, sắp xếp từ cũ đến mới (để render từ trên xuống dưới)
        const messages = await Message.find({ userId: targetUserId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const targetUserId = req.user.role === 'admin' ? req.params.userId : req.user.id;

        if (!targetUserId) {
            return res.status(400).json({ message: "Thiếu ID người dùng." });
        }
        const senderToUpdate = req.user.role === 'admin' ? 'user' : 'admin';
        const result = await Message.updateMany(
            {
                userId: targetUserId,
                sender: senderToUpdate,
                isRead: false
            },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            message: "Đã cập nhật trạng thái đã xem.",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin lấy danh sách người dùng để hiển thị hộp thư chat
export const getChatUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        // Tối ưu hóa hiệu năng: Thay thế việc JOIN toàn bộ tin nhắn bằng Subpipeline Lookup chỉ lấy tin nhắn mới nhất
        const chatList = await User.aggregate([
            // Stage 1: Chỉ lookup tin nhắn mới nhất của từng người dùng bằng subpipeline và index
            {
                $lookup: {
                    from: "messages",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "lastMessageArr"
                }
            },
            // Stage 2: Trích xuất tin nhắn cuối cùng từ mảng kết quả
            {
                $project: {
                    userId: "$_id",
                    userName: "$fullName",
                    email: "$email",
                    avatarUrl: "$avatarUrl",
                    lastMessageObj: { $arrayElemAt: ["$lastMessageArr", 0] }
                }
            },
            // Stage 3: Định dạng cấu trúc trả về, xử lý giá trị mặc định khi chưa có cuộc hội thoại và kiểm tra trạng thái chưa đọc (unread)
            {
                $project: {
                    userId: 1,
                    userName: 1,
                    email: 1,
                    avatarUrl: 1,
                    lastMessage: { $ifNull: ["$lastMessageObj.text", "Chưa có cuộc hội thoại nào."] },
                    timestamp: { $ifNull: ["$lastMessageObj.createdAt", null] },
                    unread: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$lastMessageObj.sender", "user"] },
                                    { $eq: ["$lastMessageObj.isRead", false] }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            // Stage 4: Sắp xếp kết quả trả về, ưu tiên những người dùng có tin nhắn mới nhất lên đầu
            {
                $sort: {
                    timestamp: -1
                }
            }
        ]);

        res.status(200).json(chatList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};