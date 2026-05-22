// Đường dẫn file: src/models/Form.js
import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Liên kết với bảng User để biết chính xác ai đã gửi form
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    courseInterest: {
        type: String,
        required: true,
        trim: true
    },
    currentLevel: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ["pending", "contacted", "canceled"], // Các trạng thái xử lý cho Admin
        default: "pending"
    }
}, {
    timestamps: true // Tự động tạo trường createdAt và updatedAt
});

const Form = mongoose.model("Form", formSchema);
export default Form;