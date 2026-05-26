import express from 'express';
import {
  getSongs,
  getSongBySlug,
  searchSongs,
  createSong,
  updateSong,
  deleteSong,
  restoreSong,
  getTrendingSongs,
  getRecentSongs,
  getTags,
  syncSongs
} from '../controllers/song.controller.js';


import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { songCreateSchema, songUpdateSchema } from '../validators/song.validator.js';

const router = express.Router();

// Public routes
router.get('/sync', syncSongs);
router.get('/search', searchSongs);
router.get('/trending', getTrendingSongs);
router.get('/recent', getRecentSongs);
router.get('/', getSongs);
router.get('/tags', getTags);
router.get('/:slug', getSongBySlug);

// Admin routes
router.use(requireAuth, requireAdmin);
router.post('/', validate(songCreateSchema), createSong);
router.put('/:id', validate(songUpdateSchema), updateSong);
router.delete('/:id', deleteSong);
router.post('/:id/restore', restoreSong);

export default router;
