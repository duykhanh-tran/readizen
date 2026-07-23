import mongoose from 'mongoose';
import { generateVnSlug } from '../utils/slugify.js';

const assetObjectSchema = new mongoose.Schema({
  storageProvider: {
    type: String,
    enum: ['external', 'cloudinary', 'r2'],
    default: 'external',
  },
  assetUrl: {
    type: String,
    required: true,
    trim: true,
  },
  assetKey: {
    type: String,
    trim: true,
  },
  resourceType: {
    type: String,
    default: 'image',
  },
  format: {
    type: String,
  },
  bytes: {
    type: Number,
    default: 0,
  }
}, { _id: false });

const podcastSeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề Podcast Series là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  coverAsset: {
    type: assetObjectSchema,
    required: [true, 'Ảnh đại diện/bìa Series là bắt buộc'],
  },
  host: {
    type: String,
    default: 'Readizen Podcast',
    trim: true,
  },
  targetAudience: {
    type: String,
    default: 'Phụ huynh có con 5+',
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
  seoTitle: {
    type: String,
    trim: true,
  },
  seoDescription: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

podcastSeriesSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }
});

const PodcastSeries = mongoose.model('PodcastSeries', podcastSeriesSchema);
export default PodcastSeries;
