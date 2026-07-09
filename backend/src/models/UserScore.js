import mongoose from 'mongoose';

const userScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    sentencesScore: [{
        sentenceText: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    averageScore: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userScoreSchema.index({ userId: 1, completedAt: -1 });

const UserScore = mongoose.model('UserScore', userScoreSchema);
export default UserScore;
