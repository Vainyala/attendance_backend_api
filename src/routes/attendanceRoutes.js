const express = require ('express');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const { createAtt, listAtt, getAtt, getAttByEmpId } = require ('../controllers/attendanceController.js');

const router = express.Router();

router.post('/', jwtAuth,  createAtt);
router.get('/', jwtAuth, listAtt);
router.get('/:emp_id', jwtAuth, getAttByEmpId);
router.get('/:att_id', jwtAuth, getAtt);

module.exports = router;
