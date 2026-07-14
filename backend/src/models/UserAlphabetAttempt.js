import mongoose from 'mongoose';

const userAlphabetAttemptSchema = new mongoose.Schema({
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
    averageScore: {
        type: Number,
        required: true
    },
    wordScores: [{
        word: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

userAlphabetAttemptSchema.index({ userId: 1, createdAt: -1 });

const UserAlphabetAttempt = mongoose.model('UserAlphabetAttempt', userAlphabetAttemptSchema);
export default UserAlphabetAttempt;
