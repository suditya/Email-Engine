const mongoose = require( 'mongoose' );


const connect = async () => {
    try {
        await mongoose.connect( `mongodb://127.0.0.1:27017/EmailCommunicationEnginDB` );
        console.log( 'connected to db' );
    } catch( error ) {
        console.error( error.message );
        process.exit( 1 );
    }
};

module.exports = {
    connect
}