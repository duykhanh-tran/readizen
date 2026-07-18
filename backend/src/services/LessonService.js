import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import UserScore from '../models/UserScore.js';
import { logAdminActivity } from '../utils/adminLogger.js';

class LessonService {
    async createLesson(lessonData, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { title, level, coverImage, pdfFile, ebookImages, practiceSentences, status, smartCode } = lessonData;
            const newLesson = new Lesson({
                title,
                level,
                coverImage,
                pdfFile,
                ebookImages,
                practiceSentences,
                status: status || 'active',
                smartCode
            });
            await newLesson.save({ session });
            await logAdminActivity(userId, 'CREATE', 'Reading', `Đã tạo bài học đọc AI: "${title}"`, { session });
            await session.commitTransaction();
            return newLesson;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAdminLessons(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const total = await Lesson.countDocuments();
        const lessons = await Lesson.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            lessons,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLessons: total
        };
    }

    async getAdminLessonById(id) {
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            throw new Error('Không tìm thấy bài học.');
        }
        return lesson;
    }

    async updateLesson(id, lessonData, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { title, level, coverImage, pdfFile, ebookImages, practiceSentences, status, smartCode } = lessonData;
            const lesson = await Lesson.findById(id).session(session);
            if (!lesson) {
                throw new Error('Không tìm thấy bài học cần cập nhật.');
            }

            lesson.title = title;
            lesson.level = level;
            lesson.coverImage = coverImage;
            lesson.pdfFile = pdfFile;
            lesson.ebookImages = ebookImages;
            lesson.practiceSentences = practiceSentences;
            if (status) {
                lesson.status = status;
            }
            if (smartCode !== undefined) {
                lesson.smartCode = smartCode;
            }

            await lesson.save({ session });
            await logAdminActivity(userId, 'UPDATE', 'Reading', `Đã cập nhật bài học đọc AI: "${title}"`, { session });
            await session.commitTransaction();
            return lesson;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async deleteLesson(id, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const lesson = await Lesson.findByIdAndDelete(id).session(session);
            if (!lesson) {
                throw new Error('Không tìm thấy bài học để xóa.');
            }
            await logAdminActivity(userId, 'DELETE', 'Reading', `Đã xóa bài học đọc AI: "${lesson.title}"`, { session });
            await session.commitTransaction();
            return lesson;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getClientLessons() {
        return await Lesson.find({ status: 'active' }).sort({ createdAt: -1 });
    }

    async getClientLessonById(id) {
        const lesson = await Lesson.findOne({ _id: id, status: 'active' });
        if (!lesson) {
            throw new Error('Bài học không tồn tại hoặc đã bị ẩn.');
        }
        return lesson;
    }

    async createUserScore(scoreData, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { lessonId, sentencesScore, averageScore } = scoreData;

            const lesson = await Lesson.findById(lessonId).session(session);
            if (!lesson) {
                throw new Error('Bài học không tồn tại.');
            }

            const newUserScore = new UserScore({
                userId,
                lessonId,
                sentencesScore,
                averageScore,
                completedAt: new Date()
            });

            await newUserScore.save({ session });
            await session.commitTransaction();
            return newUserScore;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getUserScores(userId) {
        return await UserScore.find({ userId })
            .populate('lessonId', 'title coverImage')
            .sort({ completedAt: -1 });
    }
}

export default new LessonService();
