import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("❌ Cách dùng: node src/scripts/createAdmin.js <username> <password>");
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

        const existing = await Admin.findOne({ username: username.toLowerCase() });
        if (existing) {
            console.log(`❌ Tài khoản admin với username "${username}" đã tồn tại!`);
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username: username.toLowerCase(),
            hashedPassword
        });

        await newAdmin.save();
        console.log(`✅ Đã tạo tài khoản admin thành công:`);
        console.log(`- Username: ${username}`);
        
        await mongoose.disconnect();
        console.log("🔌 Đã ngắt kết nối MongoDB.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi xảy ra:", error);
        process.exit(1);
    }
};

createAdmin();
