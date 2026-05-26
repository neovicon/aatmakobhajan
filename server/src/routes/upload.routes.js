import express from 'express';
import { uploadMedia } from '../controllers/upload.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadImage, uploadAudio, uploadVideo } from '../middleware/upload.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/image', uploadImage.single('file'), uploadMedia);
router.post('/audio', uploadAudio.single('file'), uploadMedia);
router.post('/video', uploadVideo.single('file'), uploadMedia);

export default router;
