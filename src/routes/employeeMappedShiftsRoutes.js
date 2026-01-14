const express = require ('express');
const { createEmpMappedShift, listEmpMappedShift, getEmpMappedShift, 
} = require ('../controllers/employeeMappedShiftsController.js');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const router = express.Router();

router.post('/', jwtAuth, createEmpMappedShift);
router.get('/',  jwtAuth, listEmpMappedShift);
router.get('/:emp_id',  jwtAuth, getEmpMappedShift);

module.exports = router;
