import mongoose from 'mongoose';

const wordScoreSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    highestScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

const userAlphabetScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alphabetLessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AlphabetLesson',
        required: true
    },
    wordScores: [wordScoreSchema],
    averageScore: {
        type: Number,
        required: true,
        default: 0
    },
    attempts: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

userAlphabetScoreSchema.index({ userId: 1, alphabetLessonId: 1 }, { unique: true });

const UserAlphabetScore = mongoose.model('UserAlphabetScore', userAlphabetScoreSchema);
export default UserAlphabetScore;
