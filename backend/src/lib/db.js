import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import AlphabetLesson from "../models/AlphabetLesson.js";

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

const seedAlphabetLessons = async () => {
    try {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        let seededCount = 0;
        
        for (const char of alphabet) {
            const exists = await AlphabetLesson.findOne({ letter: char });
            if (!exists) {
                const newLesson = new AlphabetLesson({
                    letter: char,
                    thumbnail: `https://placehold.co/150?text=${char}`,
                    status: 'draft',
                    vocabularies: []
                });
                await newLesson.save();
                seededCount++;
            }
        }
        
        if (seededCount > 0) {
            console.log(`✅ Đã khởi tạo thành công ${seededCount} chữ cái mới (A-Z) vào Database.`);
        }
    } catch (error) {
        console.error('Lỗi khi seed bảng chữ cái A-Z:', error);
    }
};

const connectDB = async () => {
    // Đăng ký các sự kiện giám sát trạng thái kết nối Database
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ Mongoose connection lost. Retrying...');
    });
    mongoose.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error:', err);
    });
    mongoose.connection.on('reconnected', () => {
        console.log('🔄 Mongoose reconnected successfully!');
    });

    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
        console.log("✅ Connected to MongoDB successfully");
        await createDefaultAdmin(); // Gọi hàm tạo admin sau khi kết nối DB
        await seedAlphabetLessons(); // Seed bảng chữ cái A-Z
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;