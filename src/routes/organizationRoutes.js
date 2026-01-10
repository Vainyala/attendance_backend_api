const express = require ('express');
const { createOrg, listOrgs, getOrg, updateOrg, deleteOrg 
} = require ('../controllers/organizationController.js');
const { jwtAuth } = require ('../middleware/jwtAuth.js');

const router = express.Router();

router.post('/',jwtAuth, createOrg);
router.get('/list', jwtAuth, listOrgs);
router.get('/:org_id', jwtAuth, getOrg);
router.put('/:org_id', jwtAuth, updateOrg);
router.delete('/:org_id', jwtAuth, deleteOrg);

module.exports = router;

