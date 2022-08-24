const mongoose = require('mongoose');

const mailAccountSchema = new mongoose.Schema({
    userId: String,
    companyName: String,
    email: String, 
    password: String,
})

const MailAccount = mongoose.model('MailAccount', mailAccountSchema);

module.exports = MailAccount;