const express = require ('express');
const { createEmpMappedProj, listEmpMappedProj, getEmpMappedProj, 
} = require ('../controllers/employeeMappedProjectsController.js');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const router = express.Router();

router.post('/', jwtAuth, createEmpMappedProj);
router.get('/',  jwtAuth, listEmpMappedProj);
router.get('/:emp_id',  jwtAuth, getEmpMappedProj);

module.exports = router;
