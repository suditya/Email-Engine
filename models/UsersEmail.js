const mongoose = require('mongoose');

const UserEmailSchema = new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    listName: String
})

const UserEmail = mongoose.model('UserEmail', UserEmailSchema);

module.exports = UserEmail;