require('./data/db');
// connect();


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(cors())

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


// app.use('/meetings', function(error, req,res,next){
//     res.status(error.status || 500);
//     res.send({
//         message: error.message
//     })
// })



const PORT = process.env.PORT_NUMBER || 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}) // listen() returns server
    .on('error', error => { // server.on( ... )
        console.error(error.message);
    });