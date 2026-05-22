import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }, // Đoạn chat này thuộc về khách hàng nào
    sender: {
        type: String,
        required: true,
        enum: ['user', 'admin']
    }, // Ai là người gửi dòng tin nhắn này
    text: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
export default Message;