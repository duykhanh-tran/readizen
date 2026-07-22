import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AlphabetLesson from '../models/AlphabetLesson.js';
import Lesson from '../models/Lesson.js';
import VideoLesson from '../models/VideoLesson.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_CONNECTIONSTRING || process.env.MONGODB_URI || 'mongodb://localhost:27017/readizen';

async function migrateSmartCodes() {
    try {
        console.log('🔄 Bắt đầu kết nối MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Đã kết nối MongoDB thành công.');

        console.log('🧹 Xóa toàn bộ dữ liệu SmartCodeRegistry cũ...');
        await SmartCodeRegistry.deleteMany({});

        const collections = [
            { name: 'AlphabetLesson', model: AlphabetLesson },
            { name: 'Lesson', model: Lesson },
            { name: 'VideoLesson', model: VideoLesson }
        ];

        for (const col of collections) {
            console.log(`\n📌 Đang xử lý ${col.name}...`);
            const docs = await col.model.find({});
            console.log(`Tìm thấy ${docs.length} tài liệu trong ${col.name}.`);

            for (const doc of docs) {
                const newCode = await generateUniqueSmartCode();
                doc.smartCode = newCode;
                await doc.save();
                console.log(`  - [${col.name}] ID: ${doc._id} -> SmartCode mới: ${newCode}`);
            }
        }

        console.log('\n🎉 Hoàn thành chuyển đổi mã Smart Code sang định dạng 9XXX thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi thực thi migration:', error);
        process.exit(1);
    }
}

migrateSmartCodes();
