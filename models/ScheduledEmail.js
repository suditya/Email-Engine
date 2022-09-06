const mongoose = require('mongoose');

const ScheduledEmailsSchema = new mongoose.Schema({
    userId: String,
    subject: String,
    startTime: String,
    endTime: String,
    meetingDate: String,
    ScheduleDate: String,
    from: String,
    to: String,
    description: String,
    sent: Boolean,

})

const ScheduledEmails = mongoose.model('ScheduledEmail', ScheduledEmailsSchema);

module.exports = ScheduledEmails;