import mongoose from 'mongoose';
import { generateVnSlug } from '../utils/slugify.js';
import SmartCodeRegistry from './SmartCodeRegistry.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

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

const relatedVocabularySchema = new mongoose.Schema({
  term: {
    type: String,
    required: [true, 'Từ/Cụm từ tiếng Anh là bắt buộc'],
    trim: true,
  },
  meaning: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  }
}, { _id: false });

const podcastEpisodeSchema = new mongoose.Schema({
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastSeries',
    required: false,
    default: null,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Tiêu đề tập Podcast là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  episodeNumber: {
    type: Number,
    required: false,
    default: null,
  },
  contentFormat: {
    type: String,
    enum: ['long', 'short'],
    default: 'long',
    index: true,
  },
  mediaSource: {
    type: String,
    enum: ['youtube', 'tiktok', 'upload'],
    required: [true, 'Nguồn phát media là bắt buộc'],
  },
  videoUrl: {
    type: String,
    required: [true, 'Đường dẫn video là bắt buộc'],
    trim: true,
  },
  externalVideoId: {
    type: String,
    trim: true,
  },
  aspectRatio: {
    type: String,
    enum: ['16:9', '9:16'],
    default: '16:9',
  },
  thumbnailAsset: {
    type: assetObjectSchema,
    required: [true, 'Ảnh đại diện tập là bắt buộc'],
  },
  audioAsset: {
    type: assetObjectSchema,
  },
  videoAsset: {
    type: assetObjectSchema,
  },
  duration: {
    type: String,
    default: '10 phút',
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  relatedVocabulary: [relatedVocabularySchema],
  transcript: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    index: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0,
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

podcastEpisodeSchema.pre('validate', async function() {
  if (this.title && !this.slug) {
    this.slug = generateVnSlug(this.title);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const PodcastEpisode = mongoose.model('PodcastEpisode', podcastEpisodeSchema);
export default PodcastEpisode;
