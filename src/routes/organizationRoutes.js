import express from 'express';
import { createOrg, listOrgs, getOrg, updateOrg, deleteOrg } from '../controllers/organizationController.js';


const router = express.Router();

router.post('/', createOrg);
router.get('/list', listOrgs);
router.get('/:org_id', getOrg);
router.put('/:org_id', updateOrg);
router.delete('/:org_id', deleteOrg);

export default router;

