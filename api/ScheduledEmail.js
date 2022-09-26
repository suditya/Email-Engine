const express = require('express');
const router = express.Router();


const { ScheduledEmailsController, ScheduledIndividualEmailsController, SendEmailController, SendEmailIndividualController, DeleteMeetingController } = require('../controller/scheduledEmails.controller')


router.get('/ScheduledEmails/:userId', (req, res) => {
    ScheduledEmailsController(req, res)
})

router.get('/ScheduledIndividualEmails/:userId', (req, res) => {
    ScheduledIndividualEmailsController(req, res)
})

router.get('/DeleteMeeting/:userId', (req, res) => {
    DeleteMeetingController(req, res)
})

router.post('/sendEmail', (req, res) => {
    SendEmailController(req, res)
})

router.post('/sendEmailIndividual', (req, res) => {
    SendEmailIndividualController(req, res)
})


module.exports = router;