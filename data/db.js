const mongoose = require('mongoose');

const {NODE_ENV, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME} = process.env;
// const DB_NAME = "EmailCommunicationEnginDB"

const connectionStr = NODE_ENV === 'development' ? `mongodb://${DB_HOST}/${DB_NAME}` :  `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.ebkgmgh.mongodb.net/?retryWrites=true&w=majority`;

//mongodb+srv://emailcommunicationengine:<password>@cluster0.ebkgmgh.mongodb.net/?retryWrites=true&w=majority

console.log("connectionStr", connectionStr);

mongoose.connect(connectionStr, {
    useNewUrlParser: true,
});


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