const express = require('express');
const { jwtAuth } = require('../middleware/jwtAuth.js');
const { createEmp,  listEmp, getEmp, updateEmp,
    updateEmpPartially, deleteEmp } = require('../controllers/employeeController.js');

const router = express.Router();

// Add autoGenerateId middleware BEFORE createEmp
router.post('/', jwtAuth, createEmp);
router.get('/', jwtAuth, listEmp);
router.get('/:emp_id',jwtAuth, getEmp);
router.put('/:emp_id', jwtAuth, updateEmp);
router.patch('/:emp_id', jwtAuth, updateEmpPartially);
router.delete('/:emp_id',jwtAuth, deleteEmp);

module.exports = router;