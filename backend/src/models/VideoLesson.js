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
  }
}, { timestamps: true });

// Tự động tạo slug trước khi lưu nếu slug chưa có hoặc rỗng
videoLessonSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }
});

// Chỉ mục kết hợp để đảm bảo tính duy nhất của slug trong từng chủ đề
videoLessonSchema.index({ topicId: 1, slug: 1 }, { unique: true });

const VideoLesson = mongoose.model('VideoLesson', videoLessonSchema);
export default VideoLesson;
