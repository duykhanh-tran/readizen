// Đường dẫn file: src/controllers/formController.js
import Form from "../models/Form.js";

// 1. Khách hàng gửi form đăng ký tư vấn
export const createForm = async (req, res) => {
    try {
        const { phone, courseInterest, currentLevel, message } = req.body;
        const userId = req.user.id; // Lấy từ middleware verifyToken sau khi giải mã Access Token

        if (!phone || !courseInterest) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ số điện thoại và khóa học quan tâm." });
        }

        const newForm = new Form({
            userId,
            phone,
            courseInterest,
            currentLevel,
            message
        });

        await newForm.save();
        res.status(201).json({ message: "Gửi thông tin tư vấn thành công!", data: newForm });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 2. Admin lấy toàn bộ danh sách form yêu cầu tư vấn
export const getAllForms = async (req, res) => {
    try {
        // Kiểm tra nghiêm ngặt quyền hạn dựa trên role trong Token
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        // Lấy danh sách form, đồng thời tìm trong bảng User để lấy thêm fullName và email
        const forms = await Form.find()
            .populate("userId", "fullName email")
            .sort({ createdAt: -1 }); // Form mới nhất xếp lên đầu

        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. Admin cập nhật trạng thái xử lý của form (Ví dụ: Từ chưa liên hệ -> Đã liên hệ)
export const updateFormStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Truy cập bị từ chối. Bạn không có quyền quản trị." });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "contacted", "canceled"].includes(status)) {
            return res.status(400).json({ message: "Trạng thái cập nhật không hợp lệ." });
        }

        const updatedForm = await Form.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Trả về bản ghi mới sau khi đã sửa đổi
        );

        if (!updatedForm) {
            return res.status(404).json({ message: "Không tìm thấy form yêu cầu này." });
        }

        res.status(200).json({ message: "Cập nhật trạng thái xử lý thành công!", data: updatedForm });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 4. Khách hàng lấy danh sách form yêu cầu tư vấn của chính mình
export const getMyForms = async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};