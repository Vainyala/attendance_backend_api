import express from 'express';
import { getSummary, generateAnalytics } from '../controllers/attendanceAnalyticsController.js';
import { getDailyAnalytics } from '../models/attendanceAnalyticsModel.js';
const router = express.Router();

router.post('/generate', generateAnalytics);
router.get('/summary', getSummary);
router.get('/daily', getDailyAnalytics);

export default router;
