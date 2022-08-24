const mongoose = require('mongoose');

const AllEmailsSchema = new mongoose.Schema({
    subject: String,
    startTime: {
        hours: String,
        minutes: String,
    },
    endTime: {
        hours: String,
        minutes: String,
    },
    from: String,
    to: String,
    description: String,

})

const AllEmails = mongoose.model('Emails', AllEmailsSchema);

module.exports = AllEmails;