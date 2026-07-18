import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';

export async function migrateSmartCodes() {
    try {
        console.log('🔄 Đang kiểm tra migration Smart Codes...');
        
        // 1. Migrate Lessons
        const lessonsWithoutCode = await Lesson.find({ smartCode: { $exists: false } });
        if (lessonsWithoutCode.length > 0) {
            console.log(`[Migration] Phát hiện ${lessonsWithoutCode.length} Lessons chưa có mã. Tiến hành sinh mã...`);
            for (const lesson of lessonsWithoutCode) {
                // Trigger validate/save hooks which auto-generate and register in SmartCodeRegistry
                await lesson.save();
            }
        }

        // 2. Migrate AlphabetLessons
        const alphabetsWithoutCode = await AlphabetLesson.find({ smartCode: { $exists: false } });
        if (alphabetsWithoutCode.length > 0) {
            console.log(`[Migration] Phát hiện ${alphabetsWithoutCode.length} AlphabetLessons chưa có mã. Tiến hành sinh mã...`);
            for (const alphabet of alphabetsWithoutCode) {
                await alphabet.save();
            }
        }

        // 3. Migrate VideoLessons
        const videosWithoutCode = await VideoLesson.find({ smartCode: { $exists: false } });
        if (videosWithoutCode.length > 0) {
            console.log(`[Migration] Phát hiện ${videosWithoutCode.length} VideoLessons chưa có mã. Tiến hành sinh mã...`);
            for (const video of videosWithoutCode) {
                await video.save();
            }
        }

        // 4. Double check registry: Ensure all existing smartCode documents have an entry in SmartCodeRegistry
        const lessons = await Lesson.find({ smartCode: { $exists: true, $ne: null } });
        for (const lesson of lessons) {
            const registered = await SmartCodeRegistry.exists({ resourceId: lesson._id });
            if (!registered) {
                await SmartCodeRegistry.create({
                    code: lesson.smartCode,
                    resourceId: lesson._id,
                    resourceType: 'Lesson'
                });
            }
        }

        const alphabets = await AlphabetLesson.find({ smartCode: { $exists: true, $ne: null } });
        for (const alphabet of alphabets) {
            const registered = await SmartCodeRegistry.exists({ resourceId: alphabet._id });
            if (!registered) {
                await SmartCodeRegistry.create({
                    code: alphabet.smartCode,
                    resourceId: alphabet._id,
                    resourceType: 'AlphabetLesson'
                });
            }
        }

        const videos = await VideoLesson.find({ smartCode: { $exists: true, $ne: null } });
        for (const video of videos) {
            const registered = await SmartCodeRegistry.exists({ resourceId: video._id });
            if (!registered) {
                await SmartCodeRegistry.create({
                    code: video.smartCode,
                    resourceId: video._id,
                    resourceType: 'VideoLesson'
                });
            }
        }

        console.log('✅ Hoàn tất kiểm tra migration Smart Codes.');
    } catch (error) {
        console.error('❌ Lỗi khi chạy migration Smart Codes:', error);
    }
}
