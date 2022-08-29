const express = require('express');
const router = express.Router();


const { VerifyOtpController, ReSendOTPController } = require('../controller/verification.controller');

router.post('/verifyOTP', async (req, res) => {
    VerifyOtpController(req, res)
})

router.post('/resendOTPVerification', (req, res) => {
    ReSendOTPController(req, res)
})


module.exports = router;