const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.post('/generate-otp', recoveryController.generateOTP);
router.post('/verify-otp', recoveryController.verifyOTP);
router.post('/verify-otp-only', recoveryController.verifyOTPOnly);
router.post('/password', recoveryController.changePasswordWithOTP);

module.exports = router;
