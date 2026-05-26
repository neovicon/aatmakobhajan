import express from 'express';
import { toggleFavorite, getFavorites, getUsers } from '../controllers/user.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes (require authentication)
router.use(requireAuth);
router.get('/favorites', getFavorites);
router.post('/favorites/:songId', toggleFavorite);

// Admin routes
router.get('/', requireAdmin, getUsers);

export default router;
