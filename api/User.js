const express = require('express');
const router = express.Router();


const { SigninController, SignupController } = require('../controller/users.controller');


router.post('/signup', (req, res) => {
    SignupController(req, res)
})


router.post('/signin', (req, res) => {
    SigninController(req, res)
})


module.exports = router;