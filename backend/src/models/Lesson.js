import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E'],
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    pdfFile: {
        type: String,
        required: true
    },
    ebookImages: [{
        type: String,
        required: true
    }],
    practiceSentences: [{
        text: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['active', 'draft'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
