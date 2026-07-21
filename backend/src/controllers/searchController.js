import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

export const findBySmartCode = async (req, res) => {
    try {
        const { code } = req.params;

        if (!/^[0-9]{4}$/.test(code)) {
            return res.status(400).json({ message: 'Mã Smart Code không hợp lệ. Vui lòng nhập đúng 4 chữ số.' });
        }

        const registry = await SmartCodeRegistry.findOne({ code });
        if (!registry) {
            return res.status(404).json({ message: 'Không tìm thấy nội dung tương ứng với mã này.' });
        }

        let redirectUrl = '';
        let details = null;

        if (registry.resourceType === 'Lesson') {
            details = await Lesson.findById(registry.resourceId);
            if (!details) {
                return res.status(404).json({ message: 'Bài học không còn tồn tại trong hệ thống.' });
            }
            redirectUrl = `/lessons/${registry.resourceId}`;
        } else if (registry.resourceType === 'AlphabetLesson') {
            details = await AlphabetLesson.findById(registry.resourceId);
            if (!details) {
                return res.status(404).json({ message: 'Bài học bảng chữ cái không còn tồn tại.' });
            }
            redirectUrl = `/smartabc/${registry.resourceId}`;
        } else if (registry.resourceType === 'VideoLesson') {
            details = await VideoLesson.findById(registry.resourceId).populate('topicId', 'slug');
            if (!details) {
                return res.status(404).json({ message: 'Bài học video không còn tồn tại.' });
            }
            const topicSlug = details.topicId ? details.topicId.slug : 'unknown';
            redirectUrl = `/videos/${topicSlug}/${details.slug}`;
        }

        res.status(200).json({
            message: 'Tìm thấy bài học thành công.',
            resourceType: registry.resourceType,
            resourceId: registry.resourceId,
            redirectUrl,
            details
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi tìm kiếm Smart Code.', error: error.message });
    }
};

export const generateCode = async (req, res) => {
    try {
        const code = await generateUniqueSmartCode();
        res.status(200).json({ code });
    } catch (error) {
        res.status(500).json({ message: 'Không thể sinh mã Smart Code mới.', error: error.message });
    }
};
