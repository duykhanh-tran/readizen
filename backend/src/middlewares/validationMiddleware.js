import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array().map(err => ({ 
                field: err.path, 
                message: err.msg 
            })) 
        });
    }
    next();
};

export const registerValidationRules = [
    body('email')
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Email không hợp lệ.'),
    body('password')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự.'),
    body('fullName')
        .trim()
        .notEmpty().withMessage('Họ tên không được để trống.'),
    handleValidationErrors
];

export const loginValidationRules = [
    body('email')
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Email không hợp lệ.'),
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống.'),
    handleValidationErrors
];

export const adminLoginValidationRules = [
    body('username')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Tên đăng nhập không được để trống.'),
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống.'),
    handleValidationErrors
];

export const lessonValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Tiêu đề bài học không được để trống.'),
    body('type')
        .isIn(['trial', 'premium']).withMessage('Loại bài học phải là trial hoặc premium.'),
    body('level')
        .isIn(['A', 'B', 'C', 'D', 'E']).withMessage('Level bài học phải là A, B, C, D hoặc E.'),
    body('coverImage')
        .trim()
        .notEmpty().withMessage('Ảnh bìa không được để trống.'),
    body('pdfFile')
        .trim()
        .notEmpty().withMessage('File PDF không được để trống.'),
    body('ebookImages')
        .isArray({ min: 1 }).withMessage('Bài học phải có ít nhất 1 ảnh minh họa Ebook.'),
    body('ebookImages.*')
        .trim()
        .notEmpty().withMessage('URL ảnh minh họa Ebook không được để trống.'),
    body('practiceSentences')
        .isArray({ min: 1 }).withMessage('Bài học phải có ít nhất 1 câu luyện đọc.'),
    body('practiceSentences.*.text')
        .trim()
        .notEmpty().withMessage('Văn bản câu luyện đọc không được để trống.'),
    body('status')
        .optional()
        .isIn(['active', 'draft']).withMessage('Trạng thái không hợp lệ.'),
    handleValidationErrors
];

export const userScoreValidationRules = [
    body('lessonId')
        .isMongoId().withMessage('ID bài học không hợp lệ.'),
    body('sentencesScore')
        .isArray({ min: 1 }).withMessage('Bản ghi điểm phải có ít nhất 1 câu.'),
    body('sentencesScore.*.sentenceText')
        .trim()
        .notEmpty().withMessage('Nội dung câu không được để trống.'),
    body('sentencesScore.*.score')
        .isFloat({ min: 0, max: 100 }).withMessage('Điểm số câu phải nằm trong khoảng 0-100.'),
    body('averageScore')
        .isFloat({ min: 0, max: 100 }).withMessage('Điểm trung bình phải nằm trong khoảng 0-100.'),
    handleValidationErrors
];
