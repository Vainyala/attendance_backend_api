const express = require('express');
const manualSync = require('../controllers/syncController.js');
const { jwtAuth } = require('../middleware/jwtAuth.js');

const router = express.Router();

router.post('/manual', jwtAuth, manualSync);

module.exports = router;
