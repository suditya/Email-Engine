const express = require('express');
const router = express.Router();


const { ScheduledEmailsController, SendEmailController, DeleteMeetingController } = require('../controller/ScheduledEmailsController')


router.get('/ScheduledEmails/:userId', (req, res) => {
    // console.log("userId: ", req.params['userId']);
    ScheduledEmailsController(req, res)
})

router.get('/DeleteMeeting/:userId', (req, res) => {
    // console.log("userId: ", req.params['userId']);
    DeleteMeetingController(req, res)
})


router.post('/sendEmail', (req, res) => {
    SendEmailController(req, res)
})



module.exports = router;