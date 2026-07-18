import express from 'express';
import { param } from 'express-validator';
import { getBySmartCode, generateCode } from '../controllers/searchController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// GET /api/search/generate-code (Admin only, to pre-fill smart code in creation form)
router.get('/generate-code', verifyAdmin, generateCode);

// GET /api/search/smart-code/:code (Public, resolves smart code for redirection)
router.get(
    '/smart-code/:code',
    [
        param('code')
            .matches(/^[0-9]{4}$/)
            .withMessage('Mã Smart Code phải gồm đúng 4 chữ số!'),
        handleValidationErrors
    ],
    getBySmartCode
);

export default router;
