const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    userId: String,
    listName: String
})

const List = mongoose.model('List', listSchema);

module.exports = List;