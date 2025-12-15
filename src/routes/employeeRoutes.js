import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createEmp, listEmp, getEmp, updateEmp, updateEmpPartially, deleteEmp } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/', createEmp);
router.get('/',  listEmp);
router.get('/:emp_id',  getEmp);
router.put('/:emp_id',  updateEmp);
router.patch('/:emp_id', updateEmpPartially); 
router.delete('/:emp_id',  deleteEmp);

export default router;
