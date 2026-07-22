import dotenv from 'dotenv';
import connectDB from '../lib/db.js';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import SmartCodeConfig from '../models/SmartCodeConfig.js';

dotenv.config();

const run = async () => {
    try {
        await connectDB();
        console.log('🔄 Connected to database. Starting smart code migration...');

        // 1. Ensure config exists
        const defaultConfigs = [
            { resourceType: 'AlphabetLesson', prefix: '1' },
            { resourceType: 'Lesson', prefix: '2' },
            { resourceType: 'VideoLesson', prefix: '3' }
        ];
        for (const config of defaultConfigs) {
            await SmartCodeConfig.findOneAndUpdate(
                { resourceType: config.resourceType },
                { $setOnInsert: { prefix: config.prefix } },
                { upsert: true }
            );
        }

        // 2. Clear SmartCodeRegistry to prevent transient collision errors
        console.log('🧹 Clearing SmartCodeRegistry...');
        await SmartCodeRegistry.deleteMany({});

        // 3. Migrate AlphabetLesson (Prefix 1)
        const alphabets = await AlphabetLesson.find({}).sort({ createdAt: 1 });
        console.log(`Migrating ${alphabets.length} AlphabetLessons...`);
        for (let i = 0; i < alphabets.length; i++) {
            const suffix = String(i + 1).padStart(3, '0');
            const code = `1${suffix}`;
            
            // Bypass pre-validate hook by updating directly
            await AlphabetLesson.updateOne({ _id: alphabets[i]._id }, { smartCode: code });
            await SmartCodeRegistry.create({
                code,
                resourceId: alphabets[i]._id,
                resourceType: 'AlphabetLesson'
            });
        }

        // 4. Migrate Lesson (Prefix 2)
        const lessons = await Lesson.find({}).sort({ createdAt: 1 });
        console.log(`Migrating ${lessons.length} Lessons...`);
        for (let i = 0; i < lessons.length; i++) {
            const suffix = String(i + 1).padStart(3, '0');
            const code = `2${suffix}`;
            
            await Lesson.updateOne({ _id: lessons[i]._id }, { smartCode: code });
            await SmartCodeRegistry.create({
                code,
                resourceId: lessons[i]._id,
                resourceType: 'Lesson'
            });
        }

        // 5. Migrate VideoLesson (Prefix 3)
        const videos = await VideoLesson.find({}).sort({ createdAt: 1 });
        console.log(`Migrating ${videos.length} VideoLessons...`);
        for (let i = 0; i < videos.length; i++) {
            const suffix = String(i + 1).padStart(3, '0');
            const code = `3${suffix}`;
            
            await VideoLesson.updateOne({ _id: videos[i]._id }, { smartCode: code });
            await SmartCodeRegistry.create({
                code,
                resourceId: videos[i]._id,
                resourceType: 'VideoLesson'
            });
        }

        console.log('✅ Smart Code migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

run();
