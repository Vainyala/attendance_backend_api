const express = require ('express');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const { createProjSite, listProjsSite, getProjSite, 
} = require ('../controllers/projectSiteController.js');


const router = express.Router();

router.post('/', jwtAuth, createProjSite);
router.get('/', jwtAuth, listProjsSite);
router.get('/:project_site_id', jwtAuth, getProjSite);

module.exports = router;
