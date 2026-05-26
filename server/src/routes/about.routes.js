import express from 'express';
import { getAppInfo, updateAppInfo } from '../controllers/about.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { appInfoUpdateSchema } from '../validators/appInfo.validator.js';

const router = express.Router();

router.get('/', getAppInfo);
router.put('/', requireAuth, requireAdmin, validate(appInfoUpdateSchema), updateAppInfo);

export default router;
