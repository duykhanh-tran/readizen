import mongoose from 'mongoose';

const userBookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemType: {
        type: String,
        enum: ['lesson', 'video', 'alphabet', 'podcast'],
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
    },
    podcastEpisodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PodcastEpisode',
        required: false
    }
}, {
    timestamps: true
});

// A user can bookmark a specific lesson, video, alphabet, or podcast episode only once
userBookmarkSchema.index({ userId: 1, itemType: 1, lessonId: 1, videoLessonId: 1, alphabetLessonId: 1, podcastEpisodeId: 1 }, { unique: true });

const UserBookmark = mongoose.model('UserBookmark', userBookmarkSchema);
export default UserBookmark;
