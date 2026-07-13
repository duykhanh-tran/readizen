import Lesson from '../models/Lesson.js';
import UserScore from '../models/UserScore.js';
import { AssemblyAI } from 'assemblyai';
import { logAdminActivity } from '../utils/adminLogger.js';

// Helper: Chuẩn hóa chuỗi tiếng Anh (chữ thường, loại bỏ dấu câu, nén khoảng trắng)
const normalizeText = (text) => {
    return (text || '')
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

// Helper: Tính khoảng cách Levenshtein giữa 2 chuỗi
const getLevenshteinDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Thay thế
                    matrix[i][j - 1] + 1,     // Chèn
                    matrix[i - 1][j] + 1      // Xóa
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

// Helper: Tính tỷ lệ tương đồng (0.0 -> 1.0) dựa trên khoảng cách Levenshtein
const getStringSimilarity = (s1, s2) => {
    const a = normalizeText(s1);
    const b = normalizeText(s2);
    if (a.length === 0 && b.length === 0) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;
    const maxLen = Math.max(a.length, b.length);
    const dist = getLevenshteinDistance(a, b);
    return (maxLen - dist) / maxLen;
};

// ================= ADMIN CONTROLLERS =================

// Create a new lesson
export const createLesson = async (req, res) => {
    try {
        const { title, level, coverImage, pdfFile, ebookImages, practiceSentences, status } = req.body;

        const newLesson = new Lesson({
            title,
            level,
            coverImage,
            pdfFile,
            ebookImages,
            practiceSentences,
            status: status || 'active'
        });

        await newLesson.save();
        await logAdminActivity(req.user.id, 'CREATE', 'Reading', `Đã tạo bài học đọc AI: "${title}"`);
        res.status(201).json({ message: 'Tạo bài học mới thành công!', lesson: newLesson });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo bài học', error: error.message });
    }
};

// Get all lessons (for admin, with pagination)
export const getAdminLessons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Lesson.countDocuments();
        const lessons = await Lesson.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            lessons,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLessons: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài học', error: error.message });
    }
};

// Get a single lesson by ID for admin (including drafts)
export const getAdminLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học.' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết bài học', error: error.message });
    }
};

// Update lesson details
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, level, coverImage, pdfFile, ebookImages, practiceSentences, status } = req.body;

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học cần cập nhật.' });
        }

        lesson.title = title;
        lesson.level = level;
        lesson.coverImage = coverImage;
        lesson.pdfFile = pdfFile;
        lesson.ebookImages = ebookImages;
        lesson.practiceSentences = practiceSentences;
        if (status) {
            lesson.status = status;
        }

        await lesson.save();
        await logAdminActivity(req.user.id, 'UPDATE', 'Reading', `Đã cập nhật bài học đọc AI: "${title}"`);
        res.status(200).json({ message: 'Cập nhật bài học thành công!', lesson });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật bài học', error: error.message });
    }
};

// DELETE a lesson by ID (Admin only)
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học để xóa.' });
        }
        await logAdminActivity(req.user.id, 'DELETE', 'Reading', `Đã xóa bài học đọc AI: "${lesson.title}"`);
        res.status(200).json({ message: 'Xóa bài học thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa bài học', error: error.message });
    }
};

// ================= CLIENT CONTROLLERS =================

// Get active lessons for clients
export const getClientLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài học', error: error.message });
    }
};

// Get a single lesson by ID for clients
export const getClientLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findOne({ _id: id, status: 'active' });
        if (!lesson) {
            return res.status(404).json({ message: 'Bài học không tồn tại hoặc đã bị ẩn.' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết bài học', error: error.message });
    }
};

// Save user's reading score
export const createUserScore = async (req, res) => {
    try {
        const { lessonId, sentencesScore, averageScore } = req.body;
        const userId = req.user.id;

        // Verify that the lesson exists
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Bài học không tồn tại.' });
        }

        const newUserScore = new UserScore({
            userId,
            lessonId,
            sentencesScore,
            averageScore,
            completedAt: new Date()
        });

        await newUserScore.save();
        res.status(201).json({ message: 'Lưu kết quả học tập thành công!', score: newUserScore });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lưu điểm học tập', error: error.message });
    }
};

// Get scores for the current user
export const getUserScores = async (req, res) => {
    try {
        const userId = req.user.id;

        const scores = await UserScore.find({ userId })
            .populate('lessonId', 'title coverImage')
            .sort({ completedAt: -1 });

        res.status(200).json(scores);
    } catch (error) {
        res.status(550).json({ message: 'Lỗi khi lấy lịch sử điểm số', error: error.message });
    }
};

// Evaluate speaking audio using AssemblyAI with Levenshtein guards
export const evaluateAudioSpeech = async (req, res) => {
    try {
        const { textToRead } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng gửi file ghi âm để chấm điểm.' });
        }
        if (!textToRead) {
            return res.status(400).json({ message: 'Thiếu nội dung câu đọc mẫu (textToRead).' });
        }

        const audioBuffer = req.file.buffer;
        const targetWords = textToRead.trim().split(/\s+/);

        console.log('--- AUDIO EVALUATION REPORT ---');
        console.log('Target Text:', textToRead);
        console.log('Received File Size:', req.file.size, 'bytes');

        const isMock = !process.env.ASSEMBLYAI_API_KEY || 
                       process.env.ASSEMBLYAI_API_KEY === 'your_assemblyai_key';

        console.log('Mode:', isMock ? 'MOCK' : 'PRODUCTION (AssemblyAI)');

        if (isMock) {
            console.log('⚠️ AssemblyAI is not configured. Simulating speech transcription & Levenshtein similarity...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Chốt chặn 1: Xử lý rỗng nếu audio gửi lên quá ngắn (im lặng)
            if (req.file.size < 2000) {
                console.log('Evaluation Result: 0 points (Mock: Audio size too small < 2KB)');
                return res.status(200).json({
                    score: 0,
                    transcript: "",
                    wordsFeedback: targetWords.map(w => ({
                        word: w,
                        cleanWord: normalizeText(w),
                        confidence: 0,
                        correct: false
                    })),
                    reason: "No speech detected"
                });
            }

            // Giả lập đọc đúng (95% similarity, 92% confidence)
            const similarity = 0.95;
            const avgConfidence = 0.92;
            const finalScore = Math.round((similarity * 0.6 + avgConfidence * 0.4) * 100);

            console.log('Evaluation Result: MOCK SUCCESS (Score:', finalScore, ')');
            return res.status(200).json({
                score: Math.min(100, Math.max(0, finalScore)),
                transcript: textToRead,
                wordsFeedback: targetWords.map(word => ({
                    word,
                    cleanWord: normalizeText(word),
                    confidence: 0.90 + Math.random() * 0.10,
                    correct: true
                }))
            });
        }

        // Thực tế gọi AssemblyAI SDK
        const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
        
        let transcript;
        try {
            // 1. Upload audio buffer
            const uploadResponse = await client.files.upload(audioBuffer);
            const uploadUrl = uploadResponse.upload_url || uploadResponse;

            // 2. Start transcript polling with 500ms intervals
            const pollTranscript = async () => {
                let response = await client.transcripts.create({
                    audio_url: uploadUrl,
                    word_boost: targetWords,
                    boost_param: 'high'
                });
                const transcriptId = response.id;
                
                const startTime = Date.now();
                while (response.status === 'queued' || response.status === 'processing') {
                    if (Date.now() - startTime > 10000) {
                        console.warn('Background polling loop auto-terminated (10s safety limit reached)');
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                    response = await client.transcripts.get(transcriptId);
                }
                return response;
            };

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('AssemblyAI transcription timed out (8s limit reached)'));
                }, 8000);
            });

            transcript = await Promise.race([
                pollTranscript(),
                timeoutPromise
            ]);
        } catch (pollErr) {
            console.warn('AssemblyAI polling or timeout error:', pollErr.message);
            return res.status(200).json({
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: `AssemblyAI error or timeout: ${pollErr.message}`
            });
        }

        if (transcript.status === 'error') {
            console.warn('AssemblyAI transcription error:', transcript.error);
            return res.status(200).json({
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: `AssemblyAI error: ${transcript.error}`
            });
        }

        const recognizedText = transcript.text || '';
        const recognizedWords = transcript.words || [];

        console.log('AssemblyAI Recognized Text:', recognizedText);
        console.log('AssemblyAI Recognized Words Count:', recognizedWords.length);

        // 1. Chốt chặn 1: Xử lý rỗng (Empty Speech)
        if (!recognizedText.trim() || recognizedWords.length === 0) {
            console.log('Evaluation Result: 0 points (No speech detected by AssemblyAI)');
            return res.status(200).json({
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: "No speech detected"
            });
        }

        // 2. Chốt chặn 2: So khớp chuỗi (String Similarity) bằng Levenshtein
        const similarity = getStringSimilarity(textToRead, recognizedText);
        console.log('Similarity score (Levenshtein):', similarity.toFixed(4));

        if (similarity < 0.2) {
            console.log('Evaluation Result: 0 points (Completely mismatched, similarity < 0.2)');
            return res.status(200).json({
                score: 0,
                transcript: recognizedText,
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: "Completely mismatched"
            });
        }

        // 3. Tính điểm Confidence: Chỉ lấy các từ khớp với câu mẫu ban đầu
        let matchedCount = 0;
        let totalConfidence = 0;

        const wordsFeedback = targetWords.map(targetWord => {
            const cleanTarget = normalizeText(targetWord);
            
            const matchedWord = recognizedWords.find(recWord => {
                const cleanRec = normalizeText(recWord.text);
                return cleanRec === cleanTarget;
            });

            if (matchedWord) {
                matchedCount++;
                totalConfidence += matchedWord.confidence;
                return {
                    word: targetWord,
                    cleanWord: cleanTarget,
                    confidence: matchedWord.confidence,
                    correct: matchedWord.confidence >= 0.6
                };
            } else {
                return {
                    word: targetWord,
                    cleanWord: cleanTarget,
                    confidence: 0,
                    correct: false
                };
            }
        });

        // 4. Công thức toán học chấm điểm
        const averageConfidence = matchedCount > 0 ? (totalConfidence / matchedCount) : 0;
        const finalScore = Math.round((similarity * 0.6 + averageConfidence * 0.4) * 100);

        console.log('Average Confidence:', averageConfidence.toFixed(4));
        console.log('Final Score:', finalScore);

        res.status(200).json({
            score: Math.max(0, Math.min(100, finalScore)),
            transcript: recognizedText,
            wordsFeedback
        });

    } catch (error) {
        console.error('Audio speech assessment error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xử lý chấm điểm phát âm.', error: error.message });
    }
};
