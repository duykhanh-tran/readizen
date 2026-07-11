import dotenv from 'dotenv';
import connectDB from '../lib/db.js';
import VideoLesson from '../models/VideoLesson.js';
import { generateVnSlug } from '../utils/slugify.js';

dotenv.config();

const migrate = async () => {
  try {
    await connectDB();
    console.log('Connected to Database. Finding lessons without slugs...');

    const lessons = await VideoLesson.find({
      $or: [{ slug: { $exists: false } }, { slug: '' }]
    });

    console.log(`Found ${lessons.length} video lessons to migrate.`);

    for (const lesson of lessons) {
      const generatedSlug = generateVnSlug(lesson.title);
      lesson.slug = generatedSlug;
      await lesson.save();
      console.log(`Migrated lesson: "${lesson.title}" -> "${generatedSlug}"`);
    }

    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
