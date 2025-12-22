import express from 'express';
import { manualSync } from '../controllers/syncController.js';

const router = express.Router();

router.post('/manual', manualSync);

export default router;
