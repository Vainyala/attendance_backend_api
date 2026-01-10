const express = require('express');
const { jwtAuth } = require('../middleware/jwtAuth.js');
const { createReg,  listReg, getReg, getRegByEmpId, updateReg, updateRegPartially, deleteReg
 } = require('../controllers/regularizationController.js');


const router = express.Router();

router.post('/', jwtAuth, createReg);
router.get('/', jwtAuth, listReg);
router.get('/:emp_id', jwtAuth, getRegByEmpId);
router.get('/:reg_id', jwtAuth, getReg);
router.put('/:reg_id', jwtAuth, updateReg);
router.patch('/:reg_id', jwtAuth, updateRegPartially); 
router.delete('/:reg_id', jwtAuth, deleteReg);

module.exports = router;
