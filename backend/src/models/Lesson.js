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
    },
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
lessonSchema.pre('validate', async function() {
    if (!this.smartCode) {
        this.smartCode = await generateUniqueSmartCode('Lesson');
    }
});

// Post-save hook to synchronize registry under the same session
lessonSchema.post('save', async function(doc) {
    const session = doc.$session();
    await SmartCodeRegistry.findOneAndUpdate(
        { resourceId: doc._id },
        { code: doc.smartCode, resourceId: doc._id, resourceType: 'Lesson' },
        { upsert: true, new: true, session }
    );
});

// Post-findOneAndDelete hook to clean up registry
lessonSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const session = this.options?.session;
        await SmartCodeRegistry.deleteOne({ resourceId: doc._id }, { session });
    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
