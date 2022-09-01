const mongoose = require('mongoose');

const DemoSchema = new mongoose.Schema({
    Subject: String,
    Admin: String,
})

const Demo = mongoose.model('Meeting', DemoSchema);

module.exports = Demo;