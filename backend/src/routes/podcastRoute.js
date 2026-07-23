import express from 'express';
import multer from 'multer';
import {
  getHubData,
  getShortsEpisodes,
  getSeriesBySlug,
  getEpisodeBySlugs,
  getAdminSeries,
  getAdminSeriesById,
  createAdminSeries,
  updateAdminSeries,
  deleteAdminSeries,
  getAdminEpisodes,
  getAdminEpisodeById,
  createAdminEpisode,
  updateAdminEpisode,
  deleteAdminEpisode,
  uploadPodcastMedia
} from '../controllers/podcastController.js';
import { verifyToken, verifyAdmin, optionalVerifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer memory storage configuration (50MB max for video uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// --- PUBLIC CLIENT ROUTES ---
router.get('/hub', optionalVerifyToken, getHubData);
router.get('/shorts', optionalVerifyToken, getShortsEpisodes);
router.get('/series/:seriesSlug', optionalVerifyToken, getSeriesBySlug);
router.get('/series/:seriesSlug/episodes/:episodeSlug', optionalVerifyToken, getEpisodeBySlugs);

// --- ADMIN MANAGEMENT ROUTES (Protected by verifyAdmin) ---
// Series CRUD
router.get('/admin/series', verifyToken, verifyAdmin, getAdminSeries);
router.get('/admin/series/:id', verifyToken, verifyAdmin, getAdminSeriesById);
router.post('/admin/series', verifyToken, verifyAdmin, createAdminSeries);
router.put('/admin/series/:id', verifyToken, verifyAdmin, updateAdminSeries);
router.delete('/admin/series/:id', verifyToken, verifyAdmin, deleteAdminSeries);

// Episode CRUD
router.get('/admin/episodes', verifyToken, verifyAdmin, getAdminEpisodes);
router.get('/admin/episodes/:id', verifyToken, verifyAdmin, getAdminEpisodeById);
router.post('/admin/episodes', verifyToken, verifyAdmin, createAdminEpisode);
router.put('/admin/episodes/:id', verifyToken, verifyAdmin, updateAdminEpisode);
router.delete('/admin/episodes/:id', verifyToken, verifyAdmin, deleteAdminEpisode);

// Media Upload Route
router.post('/admin/upload', verifyToken, verifyAdmin, upload.single('file'), uploadPodcastMedia);

export default router;
