import express from 'express';
import { getAnalytics, getAuditLogs } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/logs', getAuditLogs);

export default router;
