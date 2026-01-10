// routes/authRoutes.js
const express = require('express');
const { login, logout, refresh } = require('../controllers/authController.js');
const { jwtAuth } = require('../middleware/jwtAuth.js');

const router = express.Router();

router.post('/login', login);
router.post('/logout', jwtAuth, logout);
router.post('/refresh', jwtAuth, refresh);

module.exports = router;
