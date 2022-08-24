const { connect } = require( './data/db' );
connect();


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(cors())

const UserRouter = require('./api/User');
app.use('/user', UserRouter)


const PORT = process.env.PORT_NUMBER || 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}) // listen() returns server
    .on('error', error => { // server.on( ... )
        console.error(error.message);
    });