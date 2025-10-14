const express = require('express');
const router = express.Router();
const { getDati } = require('../controllers/bookingController');

router.get('/', getDati);

module.exports = router;
