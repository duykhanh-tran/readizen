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
    required: [true, 'Podcast Series là bắt buộc'],
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
    required: [true, 'Số tập là bắt buộc'],
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
  smartCode: {
    type: String,
    unique: true,
    sparse: true,
    minlength: 4,
    maxlength: 4,
    match: /^[0-9]{4}$/
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
  if (!this.smartCode) {
    this.smartCode = await generateUniqueSmartCode();
  }
});

// Post-save hook to synchronize SmartCodeRegistry
podcastEpisodeSchema.post('save', async function(doc) {
  if (doc.smartCode) {
    const session = doc.$session();
    await SmartCodeRegistry.findOneAndUpdate(
      { resourceId: doc._id },
      { code: doc.smartCode, resourceId: doc._id, resourceType: 'PodcastEpisode' },
      { upsert: true, new: true, session }
    );
  }
});

// Post-findOneAndDelete hook to clean up registry
podcastEpisodeSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const session = this.options?.session;
    await SmartCodeRegistry.deleteOne({ resourceId: doc._id }, { session });
  }
});

// Unique compound indexes
podcastEpisodeSchema.index({ seriesId: 1, slug: 1 }, { unique: true });
podcastEpisodeSchema.index({ seriesId: 1, episodeNumber: 1 }, { unique: true });

const PodcastEpisode = mongoose.model('PodcastEpisode', podcastEpisodeSchema);
export default PodcastEpisode;
