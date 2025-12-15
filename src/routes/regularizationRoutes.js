import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createReg,  listReg, getReg, updateReg, updateRegPartially, deleteReg
 } from '../controllers/regularizationController.js';

const router = express.Router();

router.post('/', createReg);
router.get('/',  listReg);
router.get('/:reg_id',  getReg);
router.put('/:reg_id',  updateReg);
router.patch('/:reg_id', updateRegPartially); 
router.delete('/:reg_id',  deleteReg);

export default router;
