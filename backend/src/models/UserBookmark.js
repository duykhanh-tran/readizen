import mongoose from 'mongoose';

const userBookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemType: {
        type: String,
        enum: ['lesson', 'video', 'alphabet'],
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: false
    },
    videoLessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VideoLesson',
        required: false
    },
    alphabetLessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AlphabetLesson',
        required: false
    }
}, {
    timestamps: true
});

// A user can bookmark a specific lesson, video, or alphabet lesson only once
userBookmarkSchema.index({ userId: 1, itemType: 1, lessonId: 1, videoLessonId: 1, alphabetLessonId: 1 }, { unique: true });

const UserBookmark = mongoose.model('UserBookmark', userBookmarkSchema);
export default UserBookmark;
