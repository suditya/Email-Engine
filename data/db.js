const mongoose = require('mongoose');

const DB_HOST = "127.0.0.1:27017"
const DB_NAME = "EmailCommunicationEnginDB"

const connectionStr = `mongodb://${DB_HOST}/${DB_NAME}`;

mongoose.connect(connectionStr, {
    useNewUrlParser: true,
});

const connection = mongoose.connection;

mongoose.connection.on('error', error => {
    console.error(`could not connect to database ${DB_NAME}, error = `, error.message)
    process.exit(1);
})

mongoose.connection.on('open', function() {
    console.error(`connected to database ${DB_NAME}`)
})

//     

// module.exports = {
//     connect
// }