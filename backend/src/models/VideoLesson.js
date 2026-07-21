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

import SmartCodeRegistry from './SmartCodeRegistry.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

// Tự động tạo slug trước khi lưu nếu slug chưa có hoặc rỗng
videoLessonSchema.pre('validate', async function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }
  if (!this.smartCode) {
    this.smartCode = await generateUniqueSmartCode();
  }
});

// Post-save hook to synchronize registry under the same session
videoLessonSchema.post('save', async function(doc) {
  const session = doc.$session();
  await SmartCodeRegistry.findOneAndUpdate(
    { resourceId: doc._id },
    { code: doc.smartCode, resourceId: doc._id, resourceType: 'VideoLesson' },
    { upsert: true, new: true, session }
  );
});

// Post-findOneAndDelete hook to clean up registry
videoLessonSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const session = this.options?.session;
    await SmartCodeRegistry.deleteOne({ resourceId: doc._id }, { session });
  }
});

// Chỉ mục kết hợp để đảm bảo tính duy nhất của slug trong từng chủ đề
videoLessonSchema.index({ topicId: 1, slug: 1 }, { unique: true });

const VideoLesson = mongoose.model('VideoLesson', videoLessonSchema);
export default VideoLesson;
