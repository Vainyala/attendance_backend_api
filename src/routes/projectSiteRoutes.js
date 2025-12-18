import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createProjSite, listProjsSite, getProjSite, 
   // updateProj,updateProjPartially, deleteProj 
} from '../controllers/projectSiteController.js';


const router = express.Router();

router.post('/', createProjSite);
router.get('/',  listProjsSite);
router.get('/:project_site_id',  getProjSite);
// router.put('/:project_id',  updateProj);
// router.patch('/:project_id',  updateProjPartially);
// router.delete('/:project_id', deleteProj);

export default router;
