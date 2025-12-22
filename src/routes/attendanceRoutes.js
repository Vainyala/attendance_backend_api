import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createAtt, listAtt, getAtt, getAttByEmpId } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/',  createAtt);
router.get('/',  listAtt);
router.get('/:emp_id',  getAttByEmpId);
router.get('/:att_id',  getAtt);
export default router;
