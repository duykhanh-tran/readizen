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

// Hook pre('validate') tự sinh mã nếu thiếu hoặc kiểm tra trùng chéo
alphabetLessonSchema.pre('validate', async function() {
    if (!this.smartCode) {
        const { generateUniqueSmartCode } = await import('../utils/codeGenerator.js');
        this.smartCode = await generateUniqueSmartCode();
    }

    const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
    const exists = await SmartCodeRegistry.exists({
        code: this.smartCode,
        resourceId: { $ne: this._id }
    });
    if (exists) {
        throw new Error(`Mã Smart Code "${this.smartCode}" đã được sử dụng ở bài học khác.`);
    }
});

// Hook post('save') để cập nhật/tạo mới Registry tương ứng
alphabetLessonSchema.post('save', async function(doc) {
    try {
        const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
        await SmartCodeRegistry.findOneAndUpdate(
            { resourceId: doc._id },
            { code: doc.smartCode, resourceId: doc._id, resourceType: 'AlphabetLesson' },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Lỗi khi cập nhật SmartCodeRegistry cho AlphabetLesson:', err);
    }
});

// Hook post('findOneAndDelete') để giải phóng mã khi xóa tài nguyên
alphabetLessonSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
            await SmartCodeRegistry.deleteOne({ resourceId: doc._id });
        } catch (err) {
            console.error('Lỗi khi xóa SmartCodeRegistry cho AlphabetLesson:', err);
        }
    }
});

const AlphabetLesson = mongoose.model('AlphabetLesson', alphabetLessonSchema);
export default AlphabetLesson;
