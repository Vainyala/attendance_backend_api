const express = require('express');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const { create_leaves,  list_leaves, get_leaves, get_leavesByEmpId, update_leaves,
     update_leavesPartially, delete_leaves
 } = require ('../controllers/leavesController.js');


const router = express.Router();

router.post('/', jwtAuth, create_leaves);
router.get('/', jwtAuth, list_leaves);
router.get('/:emp_id', jwtAuth, get_leavesByEmpId);
router.get('/:leave_id', jwtAuth, get_leaves);
router.put('/:leave_id', jwtAuth, update_leaves);
router.patch('/:leave_id', jwtAuth, update_leavesPartially); 
router.delete('/:leave_id', jwtAuth, delete_leaves);

module.exports = router;
