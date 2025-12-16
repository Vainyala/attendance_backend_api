import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createProj, listProjs, getProj, updateProj,updateProjPartially, deleteProj } from '../controllers/projectController.js';
import { autoGenerateId } from '../middleware/autoId.js'; // NEW IMPORT

const router = express.Router();

router.post('/', autoGenerateId('project'), createProj);
router.get('/',  listProjs);
router.get('/:project_id',  getProj);
router.put('/:project_id',  updateProj);
router.patch('/:project_id',  updateProjPartially);
router.delete('/:project_id', deleteProj);

export default router;
