import AlphabetLesson from '../models/AlphabetLesson.js';
import UserAlphabetScore from '../models/UserAlphabetScore.js';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../lib/cloudinary.js';

// --- CLIENT APIS ---

// Get all 26 letters with current user's score in a single query via Aggregation $lookup
export const getAlphabetList = async (req, res) => {
    try {
        const userId = req.user?.id;
        let mappedList;

        if (userId) {
            const list = await AlphabetLesson.aggregate([
                // Join with UserAlphabetScore for current user
                {
                    $lookup: {
                        from: 'useralphabetscores',
                        let: { lessonId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$alphabetLessonId', '$$lessonId'] },
                                            { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'userScore'
                    }
                },
                // Project target fields
                {
                    $project: {
                        _id: 1,
                        letter: 1,
                        thumbnail: 1,
                        status: 1,
                        vocabulariesCount: { $size: '$vocabularies' },
                        userScoreObj: { $arrayElemAt: ['$userScore', 0] }
                    }
                },
                // Filter only published for client
                {
                    $match: { status: 'published' }
                },
                // Sort by letter
                {
                    $sort: { letter: 1 }
                }
            ]);

            mappedList = list.map(item => ({
                _id: item._id,
                letter: item.letter,
                thumbnail: item.thumbnail,
                vocabulariesCount: item.vocabulariesCount,
                averageScore: item.userScoreObj ? item.userScoreObj.averageScore : null,
                attempts: item.userScoreObj ? item.userScoreObj.attempts : 0
            }));
        } else {
            // Guest mode: simply find all published alphabet lessons
            const list = await AlphabetLesson.find({ status: 'published' }).sort({ letter: 1 });
            mappedList = list.map(item => ({
                _id: item._id,
                letter: item.letter,
                thumbnail: item.thumbnail,
                vocabulariesCount: item.vocabularies?.length || 0,
                averageScore: null,
                attempts: 0
            }));
        }

        res.status(200).json(mappedList);
    } catch (error) {
        console.error('Error in getAlphabetList:', error);
        res.status(500).json({ message: 'Lỗi server khi tải bảng chữ cái', error: error.message });
    }
};

// Get details of a single alphabet lesson
export const getAlphabetLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        
        let query = { status: 'published' };
        if (isObjectId) {
            query._id = id;
        } else {
            query.letter = id.toUpperCase();
        }

        const lesson = await AlphabetLesson.findOne(query);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy chữ cái này hoặc chưa xuất bản.' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết chữ cái', error: error.message });
    }
};

// Save or update user score
export const saveAlphabetScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { alphabetLessonId, scores } = req.body; // scores is array of { word, score }

        if (!alphabetLessonId || !scores || !Array.isArray(scores)) {
            return res.status(400).json({ message: 'Dữ liệu chấm điểm không hợp lệ.' });
        }

        let userScore = await UserAlphabetScore.findOne({ userId, alphabetLessonId });

        if (userScore) {
            const updatedWordScores = [...userScore.wordScores];

            scores.forEach(newWordScore => {
                const existingWordIdx = updatedWordScores.findIndex(ws => ws.word === newWordScore.word);
                if (existingWordIdx !== -1) {
                    // Update only if the new score is higher
                    if (newWordScore.score > updatedWordScores[existingWordIdx].highestScore) {
                        updatedWordScores[existingWordIdx].highestScore = newWordScore.score;
                    }
                } else {
                    updatedWordScores.push({
                        word: newWordScore.word,
                        highestScore: newWordScore.score
                    });
                }
            });

            userScore.wordScores = updatedWordScores;
            userScore.attempts += 1;

            // Recalculate averageScore
            const total = userScore.wordScores.reduce((sum, ws) => sum + ws.highestScore, 0);
            userScore.averageScore = Math.round(total / userScore.wordScores.length);

            await userScore.save();
        } else {
            const wordScores = scores.map(ws => ({
                word: ws.word,
                highestScore: ws.score
            }));

            const total = wordScores.reduce((sum, ws) => sum + ws.highestScore, 0);
            const averageScore = Math.round(total / wordScores.length);

            userScore = new UserAlphabetScore({
                userId,
                alphabetLessonId,
                wordScores,
                averageScore,
                attempts: 1
            });

            await userScore.save();
        }

        res.status(200).json({ message: 'Lưu điểm bảng chữ cái thành công!', score: userScore });
    } catch (error) {
        console.error('Error in saveAlphabetScore:', error);
        res.status(500).json({ message: 'Lỗi server khi lưu điểm bảng chữ cái', error: error.message });
    }
};

// --- ADMIN APIS ---

// Get all alphabet lessons for admin (published & draft)
export const getAdminAlphabetList = async (req, res) => {
    try {
        const list = await AlphabetLesson.find().sort({ letter: 1 });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách chữ cái của Admin', error: error.message });
    }
};

// Get single alphabet lesson for edit
export const getAdminAlphabetById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await AlphabetLesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy chữ cái này.' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Create alphabet lesson
export const createAlphabetLesson = async (req, res) => {
    try {
        const { letter, thumbnail, vocabularies, status } = req.body;

        const existing = await AlphabetLesson.findOne({ letter: letter.toUpperCase() });
        if (existing) {
            return res.status(400).json({ message: `Chữ cái ${letter.toUpperCase()} đã tồn tại.` });
        }

        const lesson = new AlphabetLesson({
            letter: letter.toUpperCase(),
            thumbnail,
            vocabularies: vocabularies || [],
            status: status || 'draft'
        });

        await lesson.save();
        res.status(201).json({ message: 'Tạo bài học bảng chữ cái thành công!', lesson });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo chữ cái', error: error.message });
    }
};

// Update alphabet lesson
export const updateAlphabetLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { letter, thumbnail, vocabularies, status } = req.body;

        const lesson = await AlphabetLesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy chữ cái.' });
        }

        lesson.letter = letter ? letter.toUpperCase() : lesson.letter;
        lesson.thumbnail = thumbnail !== undefined ? thumbnail : lesson.thumbnail;
        lesson.vocabularies = vocabularies !== undefined ? vocabularies : lesson.vocabularies;
        lesson.status = status !== undefined ? status : lesson.status;

        await lesson.save();
        res.status(200).json({ message: 'Cập nhật bài học bảng chữ cái thành công!', lesson });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật chữ cái', error: error.message });
    }
};

// Delete alphabet lesson
export const deleteAlphabetLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await AlphabetLesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy chữ cái để xóa.' });
        }
        res.status(200).json({ message: 'Xóa bài học bảng chữ cái thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa chữ cái', error: error.message });
    }
};
