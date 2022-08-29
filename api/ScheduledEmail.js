const express = require('express');
const router = express.Router();


const { ScheduledEmailsController, SendEmailController } = require('../controller/ScheduledEmailsController')


router.get('/ScheduledEmails/:userId', (req, res) => {
    // console.log("userId: ", req.params['userId']);
    ScheduledEmailsController(req, res)
})


router.post('/sendEmail', (req, res) => {
    SendEmailController(req, res)
})



module.exports = router;