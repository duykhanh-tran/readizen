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

// Hook pre('validate') tự sinh mã nếu thiếu hoặc kiểm tra trùng chéo
lessonSchema.pre('validate', async function() {
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
lessonSchema.post('save', async function(doc) {
    try {
        const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
        await SmartCodeRegistry.findOneAndUpdate(
            { resourceId: doc._id },
            { code: doc.smartCode, resourceId: doc._id, resourceType: 'Lesson' },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Lỗi khi cập nhật SmartCodeRegistry cho Lesson:', err);
    }
});

// Hook post('findOneAndDelete') để giải phóng mã khi xóa tài nguyên
lessonSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
            await SmartCodeRegistry.deleteOne({ resourceId: doc._id });
        } catch (err) {
            console.error('Lỗi khi xóa SmartCodeRegistry cho Lesson:', err);
        }
    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
