const express = require ('express');
const { getSummary, generateAnalytics } = require ('../controllers/attendanceAnalyticsController.js');
const { getDailyAnalytics } = require ('../models/attendanceAnalyticsModel.js');
const { jwtAuth } = require ('../middleware/jwtAuth.js');
const router = express.Router();

router.post('/generate', jwtAuth, generateAnalytics);
router.get('/summary', jwtAuth, getSummary);
router.get('/daily', jwtAuth, getDailyAnalytics);

module.exports = router;
