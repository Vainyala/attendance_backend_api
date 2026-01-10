const express = require ('express');
const { healthCheck } =require ('../controllers/healthController.js');

const router = express.Router();
router.get('/', healthCheck);

module.exports = router;
    