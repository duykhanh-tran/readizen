import VideoTopic from '../models/VideoTopic.js';
import VideoLesson from '../models/VideoLesson.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

// --- CLIENT APIS ---

// Get all topics sorted by order
export const getTopics = async (req, res) => {
  try {
    const { page, limit } = req.query;
    
    // Nếu không truyền page/limit, trả về toàn bộ danh sách (tương thích ngược)
    if (!page && !limit) {
      const topics = await VideoTopic.find().sort({ order: 1 });
      return res.status(200).json(topics);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await VideoTopic.countDocuments();
    const topics = await VideoTopic.find()
      .sort({ order: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      topics,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chủ đề video', error: error.message });
  }
};

// Get a single topic by slug, populate its lessons sorted by order (with optional server-side pagination)
export const getTopicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.query;
    
    const topic = await VideoTopic.findOne({ slug });
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề video này.' });
    }

    // Nếu không truyền page/limit, trả về toàn bộ bài học (tương thích ngược)
    if (!page && !limit) {
      const lessons = await VideoLesson.find({ topicId: topic._id }).sort({ order: 1 });
      return res.status(200).json({
        ...topic.toObject(),
        lessons
      });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await VideoLesson.countDocuments({ topicId: topic._id });
    const lessons = await VideoLesson.find({ topicId: topic._id })
      .sort({ order: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      ...topic.toObject(),
      lessons,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết chủ đề video', error: error.message });
  }
};

// Get a single lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await VideoLesson.findById(id).populate('topicId', 'title slug');
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học video này.' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bài học video', error: error.message });
  }
};

// Get a single lesson by topicSlug and lessonSlug
export const getLessonBySlugs = async (req, res) => {
  try {
    const { topicSlug, lessonSlug } = req.params;
    const topic = await VideoTopic.findOne({ slug: topicSlug });
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề video này.' });
    }
    const lesson = await VideoLesson.findOne({ topicId: topic._id, slug: lessonSlug }).populate('topicId', 'title slug');
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học video này.' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết bài học video', error: error.message });
  }
};

// --- ADMIN APIS ---

// Create Video Topic
export const createTopic = async (req, res) => {
  try {
    const { title, slug, thumbnail, description, order } = req.body;
    const newTopic = new VideoTopic({
      title,
      slug: slug || undefined, // will auto-slugify if empty
      thumbnail,
      description,
      order: order || 0
    });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo chủ đề video mới', error: error.message });
  }
};

// Update Video Topic
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, thumbnail, description, order } = req.body;
    const topic = await VideoTopic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề cần cập nhật.' });
    }

    topic.title = title !== undefined ? title : topic.title;
    topic.slug = slug !== undefined ? slug : topic.slug;
    topic.thumbnail = thumbnail !== undefined ? thumbnail : topic.thumbnail;
    topic.description = description !== undefined ? description : topic.description;
    topic.order = order !== undefined ? order : topic.order;

    await topic.save();
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật chủ đề video', error: error.message });
  }
};

// Delete Video Topic (also deletes associated lessons)
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await VideoTopic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề cần xóa.' });
    }
    // Delete associated lessons
    await VideoLesson.deleteMany({ topicId: id });
    res.status(200).json({ message: 'Đã xóa chủ đề video và toàn bộ bài học liên quan thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa chủ đề video', error: error.message });
  }
};

// Create Video Lesson
export const createLesson = async (req, res) => {
  try {
    const { topicId, title, slug, videoType, aspectRatio, videoUrl, thumbnail, duration, order } = req.body;
    const newLesson = new VideoLesson({
      topicId,
      title,
      slug: slug || undefined, // will auto-slugify if empty
      videoType,
      aspectRatio: aspectRatio || '16:9',
      videoUrl,
      thumbnail,
      duration: duration || '00:00',
      order: order || 0
    });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo bài học video mới', error: error.message });
  }
};

// Update Video Lesson
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { topicId, title, slug, videoType, aspectRatio, videoUrl, thumbnail, duration, order } = req.body;
    const lesson = await VideoLesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học video cần cập nhật.' });
    }

    lesson.topicId = topicId !== undefined ? topicId : lesson.topicId;
    lesson.title = title !== undefined ? title : lesson.title;
    lesson.slug = slug !== undefined ? slug : lesson.slug;
    lesson.videoType = videoType !== undefined ? videoType : lesson.videoType;
    lesson.aspectRatio = aspectRatio !== undefined ? aspectRatio : lesson.aspectRatio;
    lesson.videoUrl = videoUrl !== undefined ? videoUrl : lesson.videoUrl;
    lesson.thumbnail = thumbnail !== undefined ? thumbnail : lesson.thumbnail;
    lesson.duration = duration !== undefined ? duration : lesson.duration;
    lesson.order = order !== undefined ? order : lesson.order;

    await lesson.save();
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật bài học video', error: error.message });
  }
};

// Delete Video Lesson
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await VideoLesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học video cần xóa.' });
    }
    res.status(200).json({ message: 'Đã xóa bài học video thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài học video', error: error.message });
  }
};

// Upload Media file to Cloudinary (generic handler for MP4 or image thumbnail)
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không tìm thấy tệp tin tải lên.' });
    }
    const secureUrl = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'videos'
    );
    res.status(200).json({ url: secureUrl });
  } catch (error) {
    console.error('[Upload Media Error]:', error);
    res.status(500).json({ message: 'Lỗi khi tải tệp tin lên server', error: error.message });
  }
};
