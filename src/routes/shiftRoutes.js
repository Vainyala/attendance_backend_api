const express = require('express');
const { jwtAuth } = require('../middleware/jwtAuth.js');
const { createShift, listShift, getShift, updateShift, deleteShift } 
= require('../controllers/shiftController.js');


const router = express.Router();

router.post('/', jwtAuth, createShift);
router.get('/', jwtAuth, listShift);
router.get('/:shift_id', jwtAuth, getShift);
router.put('/:shift_id', jwtAuth, updateShift);
router.delete('/:shift_id', jwtAuth, deleteShift);

module.exports = router;
