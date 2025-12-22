import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createProjSite, listProjsSite, getProjSite, 
} from '../controllers/projectSiteController.js';


const router = express.Router();

router.post('/', createProjSite);
router.get('/',  listProjsSite);
router.get('/:project_site_id',  getProjSite);

export default router;
