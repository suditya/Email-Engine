const express = require('express');
const router = express.Router();


const { ScheduledEmailsController, SendEmailController, sendEmailImmediateController, DeleteMeetingController } = require('../controller/ScheduledEmailsController')


router.get('/ScheduledEmails/:userId', (req, res) => {
    ScheduledEmailsController(req, res)
})

router.get('/DeleteMeeting/:userId', (req, res) => {
    DeleteMeetingController(req, res)
})

router.post('/sendEmail', (req, res) => {
    console.log("ye chla");
    SendEmailController(req, res)
})

router.post('/sendEmailImmediate', (req, res) => {
    console.log("nh ye chla");
    sendEmailImmediateController(req, res)
})



module.exports = router;