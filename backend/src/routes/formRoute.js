import express from "express";
import { createForm, getAllForms, updateFormStatus, getMyForms } from "../controllers/formController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import { formSubmitValidationRules } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Tất cả các API bên dưới đều bắt buộc phải đính kèm Access Token hợp lệ ở Header Authorization
router.post("/submit", verifyToken, formSubmitValidationRules, createForm);          // Khách hàng gửi form lên
router.get("/my", verifyToken, getMyForms);               // Khách hàng lấy danh sách form của mình
router.get("/all", verifyAdmin, getAllForms);            // Admin lấy danh sách form về xem
router.put("/:id/status", verifyAdmin, updateFormStatus); // Admin cập nhật tiến độ xử lý form

export default router;