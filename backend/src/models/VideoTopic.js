import mongoose from 'mongoose';
import { generateVnSlug } from '../utils/slugify.js';

const videoTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề chủ đề là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: [true, 'Ảnh đại diện chủ đề là bắt buộc'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Tự động tạo slug trước khi lưu nếu slug chưa có hoặc rỗng
videoTopicSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }
});

const VideoTopic = mongoose.model('VideoTopic', videoTopicSchema);
export default VideoTopic;
