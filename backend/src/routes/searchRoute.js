import express from 'express';
import { findBySmartCode, generateCode } from '../controllers/searchController.js';

const router = express.Router();

router.get('/smart-code/:code', findBySmartCode);
router.get('/generate-code', generateCode);

export default router;
