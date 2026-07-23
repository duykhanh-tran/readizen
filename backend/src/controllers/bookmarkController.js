import UserBookmark from '../models/UserBookmark.js';
import Lesson from '../models/Lesson.js';
import VideoLesson from '../models/VideoLesson.js';
import PodcastEpisode from '../models/PodcastEpisode.js';

// Toggle bookmark: Adds if not exists, removes if exists
export const toggleBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemType, itemId } = req.body;

        if (!itemType || !['lesson', 'video', 'alphabet', 'podcast'].includes(itemType) || !itemId) {
            return res.status(400).json({ message: 'Dữ liệu yêu cầu không hợp lệ.' });
        }

        const query = {
            userId,
            itemType,
            ...(itemType === 'lesson' 
                ? { lessonId: itemId } 
                : itemType === 'video' 
                ? { videoLessonId: itemId } 
                : itemType === 'alphabet'
                ? { alphabetLessonId: itemId }
                : { podcastEpisodeId: itemId })
        };

        const existing = await UserBookmark.findOne(query);

        if (existing) {
            await UserBookmark.deleteOne({ _id: existing._id });
            return res.status(200).json({ bookmarked: false, message: 'Đã xóa khỏi danh sách lưu trữ.' });
        } else {
            const newBookmark = new UserBookmark(query);
            await newBookmark.save();
            return res.status(201).json({ bookmarked: true, message: 'Đã lưu bài học thành công!' });
        }
    } catch (error) {
        console.error('Error in toggleBookmark:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật lưu trữ bài học', error: error.message });
    }
};

// Get all bookmarks for the authenticated user
export const getMyBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookmarks = await UserBookmark.find({ userId })
            .populate({
                path: 'lessonId',
                select: 'title coverImage category status level difficulty readingsCount'
            })
            .populate({
                path: 'videoLessonId',
                select: 'title thumbnail videoUrl source duration status slug topicId',
                populate: {
                    path: 'topicId',
                    select: 'slug title'
                }
            })
            .populate({
                path: 'alphabetLessonId',
                select: 'letter thumbnail'
            })
            .populate({
                path: 'podcastEpisodeId',
                select: 'title episodeNumber slug thumbnailAsset seriesId smartCode duration',
                populate: {
                    path: 'seriesId',
                    select: 'slug title host'
                }
            })
            .sort({ createdAt: -1 });

        // Filter out orphaned bookmarks (items deleted by admin)
        const validBookmarks = bookmarks.filter(b => 
            (b.itemType === 'lesson' && b.lessonId) || 
            (b.itemType === 'video' && b.videoLessonId) ||
            (b.itemType === 'alphabet' && b.alphabetLessonId) ||
            (b.itemType === 'podcast' && b.podcastEpisodeId)
        );

        res.status(200).json(validBookmarks);
    } catch (error) {
        console.error('Error in getMyBookmarks:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách lưu trữ', error: error.message });
    }
};

// Check if a specific item is bookmarked by the user
export const getBookmarkStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemType, itemId } = req.query;

        if (!itemType || !['lesson', 'video', 'alphabet', 'podcast'].includes(itemType) || !itemId) {
            return res.status(400).json({ message: 'Thiếu thông tin truy vấn.' });
        }

        const query = {
            userId,
            itemType,
            ...(itemType === 'lesson' 
                ? { lessonId: itemId } 
                : itemType === 'video' 
                ? { videoLessonId: itemId } 
                : itemType === 'alphabet'
                ? { alphabetLessonId: itemId }
                : { podcastEpisodeId: itemId })
        };

        const existing = await UserBookmark.findOne(query);
        res.status(200).json({ bookmarked: !!existing });
    } catch (error) {
        console.error('Error in getBookmarkStatus:', error);
        res.status(500).json({ message: 'Lỗi server khi kiểm tra trạng thái lưu trữ', error: error.message });
    }
};
