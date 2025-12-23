import express from 'express';
import { getSummary, generateAnalytics } from '../controllers/attendanceAnalyticsController.js';

const router = express.Router();

router.post('/generate', generateAnalytics);
router.get('/summary', getSummary);

export default router;
