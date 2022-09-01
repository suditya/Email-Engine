require('dotenv').config();
require('./data/db');
// connect();


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')

const app = express();

app.use(bodyParser.json())

if(process.env.NODE_ENV === 'development'){
    app.use(cors())
}

app.use(express.static(path.join(process.cwd(), 'public')));

const UserRouter = require('./api/User');
const VerificationRouter = require('./api/Verification');
const AccountRouter = require('./api/Account');
const ListRouter = require('./api/List');
const ScheduledEmail = require('./api/ScheduledEmail');
const Demo = require('./api/Demo')
app.use('/user', UserRouter)
app.use('/verification', VerificationRouter)
app.use('/account', AccountRouter)
app.use('/list', ListRouter)
app.use('/email', ScheduledEmail)
app.use('/demo', Demo)


// app.use(function(req, res, next){
//     console.log("object: ",  path.join(process.cwd()));
//     res.sendFile(path.join(process.cwd(), 'public/dist', 'index.html'));
// })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}) // listen() returns server
    .on('error', error => { // server.on( ... )
        console.error(error.message);
    });