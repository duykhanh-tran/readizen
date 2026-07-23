import PodcastSeries from '../models/PodcastSeries.js';
import PodcastEpisode from '../models/PodcastEpisode.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import MediaStorageService from '../services/MediaStorageService.js';
import { generateVnSlug } from '../utils/slugify.js';

/**
 * Helper to extract YouTube video ID from various URL formats
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Helper to extract TikTok video ID from URL
 */
const extractTikTokId = (url) => {
  if (!url) return null;
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

/**
 * Helper to infer contentFormat ('long' | 'short') and aspectRatio ('16:9' | '9:16')
 */
const inferContentFormatAndAspect = (mediaSource, videoUrl) => {
  if (mediaSource === 'tiktok' || (videoUrl && videoUrl.toLowerCase().includes('/shorts/'))) {
    return { contentFormat: 'short', aspectRatio: '9:16' };
  }
  return { contentFormat: 'long', aspectRatio: '16:9' };
};

// ================= PUBLIC CLIENT CONTROLLERS =================

// GET /api/podcasts/hub
export const getHubData = async (req, res) => {
  try {
    const { view, q } = req.query;

    let filter = { status: 'published' };
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { transcript: searchRegex },
        { smartCode: q.trim() }
      ];
    }

    const featuredSeries = await PodcastSeries.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    const latestShorts = await PodcastEpisode.find({ ...filter, contentFormat: 'short' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .populate('seriesId', 'title slug coverAsset');

    const latestEpisodes = await PodcastEpisode.find({ ...filter, contentFormat: 'long' })
      .sort({ publishedAt: -1 })
      .limit(12)
      .populate('seriesId', 'title slug coverAsset');

    res.json({
      featuredSeries,
      latestShorts,
      latestEpisodes
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Podcast Hub:', error);
    res.status(500).json({ message: 'Không thể tải dữ liệu Podcast Hub.' });
  }
};

// GET /api/podcasts/shorts
export const getShortsEpisodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const total = await PodcastEpisode.countDocuments({ status: 'published', contentFormat: 'short' });
    const shorts = await PodcastEpisode.find({ status: 'published', contentFormat: 'short' })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('seriesId', 'title slug coverAsset host');

    res.json({
      shorts,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Shorts:', error);
    res.status(500).json({ message: 'Không thể tải danh sách Video Shorts.' });
  }
};

// GET /api/podcasts/series/:seriesSlug
export const getSeriesBySlug = async (req, res) => {
  try {
    const { seriesSlug } = req.params;
    const series = await PodcastSeries.findOne({ slug: seriesSlug, status: 'published' });

    if (!series) {
      return res.status(404).json({ message: 'Không tìm thấy Podcast Series yêu cầu.' });
    }

    const episodes = await PodcastEpisode.find({ seriesId: series._id, status: 'published' })
      .sort({ episodeNumber: 1 });

    res.json({
      series,
      episodes
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết Series:', error);
    res.status(500).json({ message: 'Không thể tải chi tiết Series.' });
  }
};

// GET /api/podcasts/series/:seriesSlug/episodes/:episodeSlug
export const getEpisodeBySlugs = async (req, res) => {
  try {
    const { seriesSlug, episodeSlug } = req.params;

    let episode = null;
    let series = null;

    if (seriesSlug && seriesSlug !== 'single' && seriesSlug !== 'readizen') {
      series = await PodcastSeries.findOne({ slug: seriesSlug });
    }

    if (series) {
      episode = await PodcastEpisode.findOne({
        seriesId: series._id,
        slug: episodeSlug,
        status: 'published'
      }).populate('seriesId', 'title slug coverAsset host targetAudience');
    }

    // Fallback: If not found in series or standalone episode without series
    if (!episode) {
      episode = await PodcastEpisode.findOne({
        slug: episodeSlug,
        status: 'published'
      }).populate('seriesId', 'title slug coverAsset host targetAudience');
    }

    if (!episode) {
      return res.status(404).json({ message: 'Không tìm thấy tập Podcast yêu cầu.' });
    }

    // Fetch episodes for playlist sidebar: series episodes OR latest single episodes
    let seriesPlaylist = [];
    if (episode.seriesId) {
      seriesPlaylist = await PodcastEpisode.find({
        seriesId: episode.seriesId._id,
        status: 'published'
      }).sort({ episodeNumber: 1 }).select('title slug episodeNumber duration thumbnailAsset mediaSource aspectRatio likesCount');
    } else {
      seriesPlaylist = await PodcastEpisode.find({
        status: 'published'
      }).sort({ publishedAt: -1 }).limit(10).select('title slug episodeNumber duration thumbnailAsset mediaSource aspectRatio likesCount');
    }

    // Fetch related episodes from other series
    const relatedEpisodes = await PodcastEpisode.find({
      _id: { $ne: episode._id },
      status: 'published'
    })
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate('seriesId', 'title slug');

    res.json({
      episode,
      seriesPlaylist,
      relatedEpisodes
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tập Podcast:', error);
    res.status(500).json({ message: 'Không thể tải chi tiết tập Podcast.' });
  }
};

// POST /api/podcasts/episodes/:id/like (Public endpoint for guest & logged in users)
export const likeEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await PodcastEpisode.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true }
    ).select('likesCount');

    if (!episode) {
      return res.status(404).json({ message: 'Không tìm thấy tập Podcast.' });
    }

    res.json({ likesCount: episode.likesCount });
  } catch (error) {
    console.error('Lỗi khi thả tim Podcast:', error);
    res.status(500).json({ message: 'Không thể thả tim bài học.' });
  }
};

// ================= ADMIN MANAGEMENT CONTROLLERS =================

// GET /api/podcasts/admin/series
export const getAdminSeries = async (req, res) => {
  try {
    const seriesList = await PodcastSeries.find({}).sort({ order: 1, createdAt: -1 });
    res.json(seriesList);
  } catch (error) {
    console.error('Lỗi khi tải danh sách Series Admin:', error);
    res.status(500).json({ message: 'Không thể tải danh sách Series.' });
  }
};

// GET /api/podcasts/admin/series/:id
export const getAdminSeriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const series = await PodcastSeries.findById(id);
    if (!series) {
      return res.status(404).json({ message: 'Không tìm thấy Podcast Series.' });
    }
    res.json(series);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết Series Admin:', error);
    res.status(500).json({ message: 'Không thể tải thông tin Podcast Series.' });
  }
};

// POST /api/podcasts/admin/series
export const createAdminSeries = async (req, res) => {
  try {
    const { title, slug, description, coverAsset, host, targetAudience, order, status, seoTitle, seoDescription } = req.body;

    if (!title || !coverAsset || !coverAsset.assetUrl) {
      return res.status(400).json({ message: 'Tiêu đề và Ảnh bìa Series là bắt buộc.' });
    }

    const newSeries = new PodcastSeries({
      title,
      slug: slug || generateVnSlug(title),
      description,
      coverAsset,
      host,
      targetAudience,
      order: order || 0,
      status: status || 'draft',
      seoTitle,
      seoDescription
    });

    await newSeries.save();
    res.status(201).json(newSeries);
  } catch (error) {
    console.error('Lỗi khi tạo Podcast Series:', error);
    res.status(500).json({ message: error.message || 'Không thể tạo Podcast Series.' });
  }
};

// PUT /api/podcasts/admin/series/:id
export const updateAdminSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title && !updateData.slug) {
      updateData.slug = generateVnSlug(updateData.title);
    }

    const updatedSeries = await PodcastSeries.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedSeries) {
      return res.status(404).json({ message: 'Không tìm thấy Series để cập nhật.' });
    }

    res.json(updatedSeries);
  } catch (error) {
    console.error('Lỗi khi cập nhật Podcast Series:', error);
    res.status(500).json({ message: error.message || 'Không thể cập nhật Podcast Series.' });
  }
};

// DELETE /api/podcasts/admin/series/:id
export const deleteAdminSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const series = await PodcastSeries.findById(id);

    if (!series) {
      return res.status(404).json({ message: 'Không tìm thấy Series để xóa.' });
    }

    if (series.coverAsset) {
      await MediaStorageService.deleteAsset(series.coverAsset);
    }

    const episodes = await PodcastEpisode.find({ seriesId: id });
    for (const ep of episodes) {
      if (ep.thumbnailAsset) await MediaStorageService.deleteAsset(ep.thumbnailAsset);
      if (ep.audioAsset) await MediaStorageService.deleteAsset(ep.audioAsset);
      if (ep.videoAsset) await MediaStorageService.deleteAsset(ep.videoAsset);
    }
    await PodcastEpisode.deleteMany({ seriesId: id });

    await PodcastSeries.findByIdAndDelete(id);
    res.json({ message: 'Đã xóa Podcast Series và các tập liên quan thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa Podcast Series:', error);
    res.status(500).json({ message: 'Không thể xóa Podcast Series.' });
  }
};

// GET /api/podcasts/admin/episodes
export const getAdminEpisodes = async (req, res) => {
  try {
    const { seriesId } = req.query;
    const filter = seriesId ? { seriesId } : {};

    const episodes = await PodcastEpisode.find(filter)
      .sort({ seriesId: 1, episodeNumber: 1, createdAt: -1 })
      .populate('seriesId', 'title slug');

    res.json(episodes);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tập Admin:', error);
    res.status(500).json({ message: 'Không thể tải danh sách tập Podcast.' });
  }
};

// GET /api/podcasts/admin/episodes/:id
export const getAdminEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await PodcastEpisode.findById(id).populate('seriesId', 'title slug');
    if (!episode) {
      return res.status(404).json({ message: 'Không tìm thấy tập Podcast.' });
    }
    res.json(episode);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tập Admin:', error);
    res.status(500).json({ message: 'Không thể tải thông tin tập Podcast.' });
  }
};

// POST /api/podcasts/admin/episodes
export const createAdminEpisode = async (req, res) => {
  try {
    const {
      seriesId,
      title,
      slug,
      episodeNumber,
      mediaSource,
      videoUrl,
      thumbnailAsset,
      audioAsset,
      videoAsset,
      duration,
      summary,
      relatedVocabulary,
      transcript,
      status,
      seoTitle,
      seoDescription
    } = req.body;

    if (!title || !episodeNumber || !mediaSource || !videoUrl || !thumbnailAsset) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
    }

    // Extract external Video ID and automatically infer contentFormat & aspectRatio
    let externalVideoId = null;
    if (mediaSource === 'youtube') {
      externalVideoId = extractYouTubeId(videoUrl);
    } else if (mediaSource === 'tiktok') {
      externalVideoId = extractTikTokId(videoUrl);
    }

    const { contentFormat, aspectRatio } = inferContentFormatAndAspect(mediaSource, videoUrl);

    // Filter valid relatedVocabulary
    const cleanVocabulary = Array.isArray(relatedVocabulary)
      ? relatedVocabulary.filter(item => item && item.term && item.term.trim() !== '')
      : [];

    const newEpisode = new PodcastEpisode({
      seriesId: seriesId || null,
      title,
      slug: slug || generateVnSlug(title),
      episodeNumber,
      contentFormat,
      mediaSource,
      videoUrl,
      externalVideoId,
      aspectRatio,
      thumbnailAsset,
      audioAsset: audioAsset || null,
      videoAsset: videoAsset || null,
      duration: duration || '10 phút',
      summary,
      relatedVocabulary: cleanVocabulary,
      transcript,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      seoTitle,
      seoDescription
    });

    await newEpisode.save();
    res.status(201).json(newEpisode);
  } catch (error) {
    console.error('Lỗi khi tạo tập Podcast:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Số tập (episodeNumber) hoặc slug đã bị trùng trong hệ thống.' });
    }
    res.status(500).json({ message: error.message || 'Không thể tạo tập Podcast.' });
  }
};

// PUT /api/podcasts/admin/episodes/:id
export const updateAdminEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.seriesId === '') {
      updateData.seriesId = null;
    }

    if (updateData.title && !updateData.slug) {
      updateData.slug = generateVnSlug(updateData.title);
    }

    if (updateData.mediaSource && updateData.videoUrl) {
      if (updateData.mediaSource === 'youtube') {
        updateData.externalVideoId = extractYouTubeId(updateData.videoUrl);
      } else if (updateData.mediaSource === 'tiktok') {
        updateData.externalVideoId = extractTikTokId(updateData.videoUrl);
      }

      const { contentFormat, aspectRatio } = inferContentFormatAndAspect(updateData.mediaSource, updateData.videoUrl);
      updateData.contentFormat = contentFormat;
      updateData.aspectRatio = aspectRatio;
    }

    if (Array.isArray(updateData.relatedVocabulary)) {
      updateData.relatedVocabulary = updateData.relatedVocabulary.filter(item => item && item.term && item.term.trim() !== '');
    }

    const episodeToUpdate = await PodcastEpisode.findById(id);
    if (!episodeToUpdate) {
      return res.status(404).json({ message: 'Không tìm thấy tập Podcast để cập nhật.' });
    }

    Object.assign(episodeToUpdate, updateData);
    await episodeToUpdate.save();

    res.json(episodeToUpdate);
  } catch (error) {
    console.error('Lỗi khi cập nhật tập Podcast:', error);
    res.status(500).json({ message: error.message || 'Không thể cập nhật tập Podcast.' });
  }
};

// DELETE /api/podcasts/admin/episodes/:id
export const deleteAdminEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await PodcastEpisode.findById(id);

    if (!episode) {
      return res.status(404).json({ message: 'Không tìm thấy tập Podcast để xóa.' });
    }

    if (episode.thumbnailAsset) await MediaStorageService.deleteAsset(episode.thumbnailAsset);
    if (episode.audioAsset) await MediaStorageService.deleteAsset(episode.audioAsset);
    if (episode.videoAsset) await MediaStorageService.deleteAsset(episode.videoAsset);

    await PodcastEpisode.findByIdAndDelete(id);
    res.json({ message: 'Đã xóa tập Podcast thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa tập Podcast:', error);
    res.status(500).json({ message: 'Không thể xóa tập Podcast.' });
  }
};

// POST /api/podcasts/admin/upload
export const uploadPodcastMedia = async (req, res) => {
  try {
    const category = req.query.category || 'thumbnail';
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn tệp tin để tải lên.' });
    }

    const assetObject = await MediaStorageService.uploadAsset(
      req.file,
      category,
      'readizen/podcasts'
    );

    res.json(assetObject);
  } catch (error) {
    console.error('Lỗi khi upload Podcast media:', error);
    res.status(400).json({ message: error.message || 'Không thể tải tệp lên máy chủ.' });
  }
};
