import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const createDefaultAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'adminpassword123';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const newAdmin = new Admin({
                username: 'admin',
                hashedPassword: hashedPassword
            });
            await newAdmin.save();
            console.log('✅ Đã tạo tài khoản Admin mặc định (username: admin)');
        }
    } catch (error) {
        console.error('Lỗi khi tạo admin mặc định:', error);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
        console.log("✅ Connected to MongoDB successfully");
        await createDefaultAdmin(); // Gọi hàm tạo admin sau khi kết nối DB
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;