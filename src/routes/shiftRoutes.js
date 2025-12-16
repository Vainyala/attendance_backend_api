import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createShift, listShift, getShift, updateShift, deleteShift } from '../controllers/shiftController.js';
import { autoGenerateId } from '../middleware/autoId.js'; // NEW IMPORT

const router = express.Router();

router.post('/', autoGenerateId('shift'), createShift);
router.get('/',  listShift);
router.get('/:shift_id',  getShift);
router.put('/:shift_id',  updateShift);
router.delete('/:shift_id',  deleteShift);

export default router;
