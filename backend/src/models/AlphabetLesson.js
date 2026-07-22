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
    vocabularies: [vocabularySchema],
    smartCode: {
        type: String,
        unique: true,
        sparse: true,
        minlength: 4,
        maxlength: 4,
        match: /^[0-9]{4}$/
    }
}, {
    timestamps: true
});

import SmartCodeRegistry from './SmartCodeRegistry.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

// Pre-validate hook to generate code if missing
alphabetLessonSchema.pre('validate', async function() {
    if (!this.smartCode) {
        this.smartCode = await generateUniqueSmartCode('AlphabetLesson');
    }
});

// Post-save hook to synchronize registry under the same session
alphabetLessonSchema.post('save', async function(doc) {
    const session = doc.$session();
    await SmartCodeRegistry.findOneAndUpdate(
        { resourceId: doc._id },
        { code: doc.smartCode, resourceId: doc._id, resourceType: 'AlphabetLesson' },
        { upsert: true, new: true, session }
    );
});

// Post-findOneAndDelete hook to clean up registry
alphabetLessonSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const session = this.options?.session;
        await SmartCodeRegistry.deleteOne({ resourceId: doc._id }, { session });
    }
});

const AlphabetLesson = mongoose.model('AlphabetLesson', alphabetLessonSchema);
export default AlphabetLesson;
