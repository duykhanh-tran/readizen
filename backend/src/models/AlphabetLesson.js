import mongoose from 'mongoose';

const vocabularySchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    }
});

const alphabetLessonSchema = new mongoose.Schema({
    letter: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 1
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    vocabularies: [vocabularySchema]
}, {
    timestamps: true
});

const AlphabetLesson = mongoose.model('AlphabetLesson', alphabetLessonSchema);
export default AlphabetLesson;
