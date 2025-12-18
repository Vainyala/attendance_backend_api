import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createAtt, listAtt, getAtt, getAttByEmpId } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/',  createAtt);
router.get('/',  listAtt);
router.get('/:att_id',  getAtt);
router.get('/:emp_id',  getAttByEmpId);

export default router;
