import LessonService from '../services/LessonService.js';
import AudioService from '../services/AudioService.js';
import { speechEvaluationQueue } from '../lib/queue.js';

// ================= ADMIN CONTROLLERS =================

// Create a new lesson
export const createLesson = async (req, res) => {
    try {
        const lesson = await LessonService.createLesson(req.body, req.user.id);
        res.status(201).json({ message: 'Tạo bài học mới thành công!', lesson });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo bài học', error: error.message });
    }
};

// Get all lessons (for admin, with pagination)
export const getAdminLessons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await LessonService.getAdminLessons(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài học', error: error.message });
    }
};

// Get a single lesson by ID for admin (including drafts)
export const getAdminLessonById = async (req, res) => {
    try {
        const lesson = await LessonService.getAdminLessonById(req.params.id);
        res.status(200).json(lesson);
    } catch (error) {
        const status = error.message === 'Không tìm thấy bài học.' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// Update lesson details
export const updateLesson = async (req, res) => {
    try {
        const lesson = await LessonService.updateLesson(req.params.id, req.body, req.user.id);
        res.status(200).json({ message: 'Cập nhật bài học thành công!', lesson });
    } catch (error) {
        const status = error.message === 'Không tìm thấy bài học cần cập nhật.' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// DELETE a lesson by ID (Admin only)
export const deleteLesson = async (req, res) => {
    try {
        await LessonService.deleteLesson(req.params.id, req.user.id);
        res.status(200).json({ message: 'Xóa bài học thành công!' });
    } catch (error) {
        const status = error.message === 'Không tìm thấy bài học để xóa.' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// ================= CLIENT CONTROLLERS =================

// Get active lessons for clients
export const getClientLessons = async (req, res) => {
    try {
        const lessons = await LessonService.getClientLessons();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài học', error: error.message });
    }
};

// Get a single lesson by ID for clients
export const getClientLessonById = async (req, res) => {
    try {
        const lesson = await LessonService.getClientLessonById(req.params.id);
        res.status(200).json(lesson);
    } catch (error) {
        const status = error.message === 'Bài học không tồn tại hoặc đã bị ẩn.' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// Save user's reading score
export const createUserScore = async (req, res) => {
    try {
        const score = await LessonService.createUserScore(req.body, req.user.id);
        res.status(201).json({ message: 'Lưu kết quả học tập thành công!', score });
    } catch (error) {
        const status = error.message === 'Bài học không tồn tại.' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// Get scores for the current user
export const getUserScores = async (req, res) => {
    try {
        const scores = await LessonService.getUserScores(req.user.id);
        res.status(200).json(scores);
    } catch (error) {
        res.status(550).json({ message: 'Lỗi khi lấy lịch sử điểm số', error: error.message });
    }
};

// Evaluate speaking audio using AssemblyAI with Levenshtein guards (Async via BullMQ)
export const evaluateAudioSpeech = async (req, res) => {
    try {
        const { textToRead, audioUrl, socketId } = req.body;
        if (!audioUrl) {
            return res.status(400).json({ message: 'Vui lòng gửi đường dẫn âm thanh để chấm điểm.' });
        }
        if (!textToRead) {
            return res.status(400).json({ message: 'Thiếu nội dung câu đọc mẫu (textToRead).' });
        }
        if (!socketId) {
            return res.status(400).json({ message: 'Thiếu định danh kết nối (socketId).' });
        }

        // Add task to BullMQ
        const job = await speechEvaluationQueue.add('evaluate-speech', {
            textToRead,
            audioUrl,
            socketId
        });

        res.status(202).json({
            jobId: job.id,
            message: 'Đã nhận yêu cầu chấm điểm. Đang xử lý...'
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đưa yêu cầu vào hàng đợi', error: error.message });
    }
};

// Check evaluation job status (HTTP Fallback for BullMQ)
export const getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await speechEvaluationQueue.getJob(jobId);
        
        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy công việc (job) yêu cầu.' });
        }

        const state = await job.getState(); // 'completed' | 'failed' | 'active' | 'waiting'

        if (state === 'completed') {
            return res.status(200).json({ status: 'completed', result: job.returnvalue });
        } else if (state === 'failed') {
            return res.status(200).json({ status: 'failed', error: job.failedReason || 'Lỗi xử lý chấm điểm' });
        } else {
            return res.status(200).json({ status: 'pending' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy trạng thái công việc', error: error.message });
    }
};
