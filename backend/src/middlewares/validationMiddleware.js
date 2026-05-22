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
