import express from 'express';
//import { jwtAuth } from '../middleware/jwtAuth.js';
import { createEmpMappedProj, listEmpMappedProj, getEmpMappedProj, 
} from '../controllers/employeeMappedProjectsController.js';

const router = express.Router();

router.post('/', createEmpMappedProj);
router.get('/',  listEmpMappedProj);
router.get('/:emp_id',  getEmpMappedProj);

export default router;
