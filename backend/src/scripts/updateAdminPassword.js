import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const updateAdminPassword = async () => {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("❌ Cách dùng: node src/scripts/updateAdminPassword.js <username> <new_password>");
        process.exit(1);
    }

    const [username, password] = args;

    try {
        const mongoURI = process.env.MONGODB_CONNECTIONSTRING;
        if (!mongoURI) {
            console.error("❌ Không tìm thấy biến môi trường MONGODB_CONNECTIONSTRING");
            process.exit(1);
        }

        await mongoose.connect(mongoURI);
        console.log("🔌 Đã kết nối đến MongoDB.");

        const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
        if (!existingAdmin) {
            console.log(`❌ Không tìm thấy tài khoản admin với username "${username}"!`);
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        existingAdmin.hashedPassword = hashedPassword;
        await existingAdmin.save();

        console.log(`✅ Đã cập nhật mật khẩu mới cho admin "${username}" thành công.`);
        
        await mongoose.disconnect();
        console.log("🔌 Đã ngắt kết nối MongoDB.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi xảy ra:", error);
        process.exit(1);
    }
};

updateAdminPassword();
