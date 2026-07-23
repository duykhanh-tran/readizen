import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import PodcastEpisode from '../models/PodcastEpisode.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import SmartCodeConfig from '../models/SmartCodeConfig.js';

export async function migrateSmartCodes() {
    console.log('🔄 Starting Smart Code migration check...');
    try {
        // 0. Seed smart code configuration if it doesn't exist
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

        // Delete any legacy PodcastEpisode config
        await SmartCodeConfig.deleteOne({ resourceType: 'PodcastEpisode' });

        // 1. Migrate Lessons
        const lessons = await Lesson.find({});
        for (const doc of lessons) {
            if (!doc.smartCode) {
                console.log(`Generating Smart Code for Lesson: ${doc.title}`);
                await doc.save(); // Triggers hooks to generate & register
            } else {
                // Ensure it exists in registry
                await SmartCodeRegistry.findOneAndUpdate(
                    { resourceId: doc._id },
                    { code: doc.smartCode, resourceId: doc._id, resourceType: 'Lesson' },
                    { upsert: true }
                );
            }
        }

        // 2. Migrate AlphabetLessons
        const alphabetLessons = await AlphabetLesson.find({});
        for (const doc of alphabetLessons) {
            if (!doc.smartCode) {
                console.log(`Generating Smart Code for AlphabetLesson: ${doc.letter}`);
                await doc.save();
            } else {
                await SmartCodeRegistry.findOneAndUpdate(
                    { resourceId: doc._id },
                    { code: doc.smartCode, resourceId: doc._id, resourceType: 'AlphabetLesson' },
                    { upsert: true }
                );
            }
        }

        // 3. Migrate VideoLessons
        const videoLessons = await VideoLesson.find({});
        for (const doc of videoLessons) {
            if (!doc.smartCode) {
                console.log(`Generating Smart Code for VideoLesson: ${doc.title}`);
                await doc.save();
            } else {
                await SmartCodeRegistry.findOneAndUpdate(
                    { resourceId: doc._id },
                    { code: doc.smartCode, resourceId: doc._id, resourceType: 'VideoLesson' },
                    { upsert: true }
                );
            }
        }

        console.log('✅ Smart Code migration check completed successfully.');
    } catch (error) {
        console.error('❌ Error during Smart Code migration:', error);
    }
}
