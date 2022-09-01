const express = require('express');
const router = express.Router();

const Demo = require('../models/Demo')

router.get('/meetings', (req, res) => {
    console.log("wehdgs", req.params['userId'])
    Demo.find().then((result) => {
        console.log(result);
        res.send(result)
    })
})

module.exports = router;