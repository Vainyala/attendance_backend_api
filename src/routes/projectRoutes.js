import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createProj, listProjs, getProj, updateProj, deleteProj } from '../controllers/projectController.js';

const router = express.Router();

router.post('/', jwtAuth, createProj);
router.get('/', jwtAuth, listProjs);
router.get('/:project_id', jwtAuth, getProj);
router.put('/:project_id', jwtAuth, updateProj);
router.delete('/:project_id', jwtAuth, deleteProj);

export default router;
