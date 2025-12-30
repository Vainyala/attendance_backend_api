import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { create_leaves,  list_leaves, get_leaves, get_leavesByEmpId, update_leaves,
     update_leavesPartially, delete_leaves
 } from '../controllers/leavesController.js';


const router = express.Router();

router.post('/',  create_leaves);
router.get('/',  list_leaves);
router.get('/:emp_id',  get_leavesByEmpId);
router.get('/:leave_id',  get_leaves);
router.put('/:leave_id',  update_leaves);
router.patch('/:leave_id', update_leavesPartially); 
router.delete('/:leave_id',  delete_leaves);

export default router;
