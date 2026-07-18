import mongoose from 'mongoose';
import { generateVnSlug } from '../utils/slugify.js';

const videoLessonSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoTopic',
    required: [true, 'Chủ đề video là bắt buộc'],
  },
  title: {
    type: String,
    required: [true, 'Tiêu đề video là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  videoType: {
    type: String,
    enum: ['youtube', 'tiktok', 'upload'],
    required: [true, 'Loại video là bắt buộc'],
  },
  aspectRatio: {
    type: String,
    enum: ['16:9', '9:16'],
    default: '16:9',
  },
  videoUrl: {
    type: String,
    required: [true, 'Đường dẫn video là bắt buộc'],
    trim: true,
  },
  thumbnail: {
    type: String,
    trim: true,
  },

  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  smartCode: {
    type: String,
    unique: true,
    sparse: true,
    minlength: 4,
    maxlength: 4,
    match: /^[0-9]{4}$/
  }
}, { timestamps: true });

// Tự động tạo slug trước khi lưu nếu slug chưa có hoặc rỗng & sinh/kiểm tra smartCode
videoLessonSchema.pre('validate', async function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }

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
videoLessonSchema.post('save', async function(doc) {
  try {
    const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
    await SmartCodeRegistry.findOneAndUpdate(
      { resourceId: doc._id },
      { code: doc.smartCode, resourceId: doc._id, resourceType: 'VideoLesson' },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Lỗi khi cập nhật SmartCodeRegistry cho VideoLesson:', err);
  }
});

// Hook post('findOneAndDelete') để giải phóng mã khi xóa tài nguyên
videoLessonSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const SmartCodeRegistry = mongoose.model('SmartCodeRegistry');
      await SmartCodeRegistry.deleteOne({ resourceId: doc._id });
    } catch (err) {
      console.error('Lỗi khi xóa SmartCodeRegistry cho VideoLesson:', err);
    }
  }
});

// Chỉ mục kết hợp để đảm bảo tính duy nhất của slug trong từng chủ đề
videoLessonSchema.index({ topicId: 1, slug: 1 }, { unique: true });

const VideoLesson = mongoose.model('VideoLesson', videoLessonSchema);
export default VideoLesson;
