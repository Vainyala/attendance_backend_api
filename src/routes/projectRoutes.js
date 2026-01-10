const express = require('express');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const { createProj, listProjs, getProj, updateProj,updateProjPartially, 
    deleteProj } = require ('../controllers/projectController.js');


const router = express.Router();

router.post('/', jwtAuth, createProj);
router.get('/', jwtAuth, listProjs);
router.get('/:project_id', jwtAuth, getProj);
router.put('/:project_id', jwtAuth, updateProj);
router.patch('/:project_id', jwtAuth, updateProjPartially);
router.delete('/:project_id', jwtAuth, deleteProj);

module.exports = router;
