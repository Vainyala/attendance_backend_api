const express = require('express');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const {create_task,  list_task, get_task, get_taskByEmpId, update_task,
     update_taskPartially, delete_task
 } = require ('../controllers/timesheetController.js');


const router = express.Router();

router.post('/', jwtAuth, create_task);
router.get('/', jwtAuth, list_task);

// 👇 clear & unambiguous
router.get('/emp/:emp_id', jwtAuth, get_taskByEmpId);
router.get('/task/:task_id', jwtAuth, get_task);

router.put('/:task_id', jwtAuth, update_task);
router.patch('/:task_id', jwtAuth, update_taskPartially);
router.delete('/:task_id', jwtAuth, delete_task);


module.exports = router;
