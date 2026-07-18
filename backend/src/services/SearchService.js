import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';

class SearchService {
    /**
     * Finds a resource by its unique smart code and returns redirect information
     * @param {string} code - The 4-digit smart code
     * @returns {Promise<Object>} Redirection information object
     */
    async findBySmartCode(code) {
        // Find in centralized registry first
        const registry = await SmartCodeRegistry.findOne({ code });
        if (!registry) {
            const error = new Error('Mã Smart Code không tồn tại. Bé kiểm tra lại nhé!');
            error.status = 404;
            throw error;
        }

        const { resourceId, resourceType } = registry;

        if (resourceType === 'Lesson') {
            const lesson = await Lesson.findById(resourceId);
            if (!lesson) {
                // If resource is deleted but registry was somehow left behind, clean it up
                await SmartCodeRegistry.deleteOne({ _id: registry._id });
                const error = new Error('Không tìm thấy bài học này.');
                error.status = 404;
                throw error;
            }
            return {
                success: true,
                type: 'lesson',
                dataId: lesson._id,
                redirectUrl: `/lessons/${lesson._id}`
            };
        }

        if (resourceType === 'AlphabetLesson') {
            const alphabet = await AlphabetLesson.findById(resourceId);
            if (!alphabet) {
                await SmartCodeRegistry.deleteOne({ _id: registry._id });
                const error = new Error('Không tìm thấy chữ cái này.');
                error.status = 404;
                throw error;
            }
            return {
                success: true,
                type: 'alphabet',
                dataId: alphabet._id,
                redirectUrl: `/smartabc/${alphabet.letter}`
            };
        }

        if (resourceType === 'VideoLesson') {
            const video = await VideoLesson.findById(resourceId).populate('topicId', 'slug');
            if (!video) {
                await SmartCodeRegistry.deleteOne({ _id: registry._id });
                const error = new Error('Không tìm thấy video bài giảng này.');
                error.status = 404;
                throw error;
            }
            const topicSlug = video.topicId?.slug || 'unknown';
            return {
                success: true,
                type: 'video',
                dataId: video._id,
                redirectUrl: `/videos/${topicSlug}/${video.slug}`
            };
        }

        const error = new Error('Loại tài nguyên không hợp lệ.');
        error.status = 400;
        throw error;
    }
}

export default new SearchService();
