import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/upload/signature
router.get('/signature', verifyToken, (req, res) => {
    try {
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const folder = req.query.folder || 'readizen';
        
        // Params to sign MUST match the params sent by client
        const paramsToSign = {
            timestamp,
            folder
        };
        
        const apiSecret = process.env.CLOUDINARY_API_SECRET || 'mock_secret';
        const apiKey = process.env.CLOUDINARY_API_KEY || 'mock_key';
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud';

        let signature = 'mock_signature';
        if (process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET !== 'your_api_secret') {
            signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
        }
        
        res.status(200).json({
            signature,
            timestamp,
            apiKey,
            cloudName,
            folder
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo chữ ký Cloudinary', error: error.message });
    }
});

export default router;
