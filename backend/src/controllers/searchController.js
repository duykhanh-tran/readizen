import SearchService from '../services/SearchService.js';
import { generateUniqueSmartCode } from '../utils/codeGenerator.js';

/**
 * Resolves a smart code to its target redirect URL
 */
export const getBySmartCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await SearchService.findBySmartCode(code);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Generates a unique 4-digit code (for Admin Form pre-fill)
 */
export const generateCode = async (req, res, next) => {
    try {
        const code = await generateUniqueSmartCode();
        res.status(200).json({ code });
    } catch (error) {
        next(error);
    }
};
