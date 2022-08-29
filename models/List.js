const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    userId: String,
    listName: String,
    description: String,
})

const List = mongoose.model('List', listSchema);

module.exports = List;