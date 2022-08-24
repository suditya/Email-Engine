const express = require('express');
const router = express.Router();


const { SigninController, SignupController } = require('../controller/users.controller');
const { VerifyOtp, SendOTP, SendEmailController } = require('../controller/verification.controller');

const { MailAccountsController, AddAccountController, DeleteAccountController } = require('../controller/accounts.controller')

const { AddListController, AllListsController, UsersEmailsController, DeleteListController, AddUserController } = require('../controller/lists.controller')


router.post('/signup', (req, res) => {
    SignupController(req, res)
})

router.post('/verifyOTP', async (req, res) => {
    VerifyOtp(req, res)
})

router.post('/signin', (req, res) => {
    SigninController(req, res)
})

router.post('/resendOTPVerification', (req, res) => {
    SendOTP(req, res)
})

router.get('/mailAccounts/:userId', (req, res) => {
    console.log("wehdgs", req.params['userId'])
    MailAccountsController(req, res)
})

router.post('/addAccount', (req, res) => {
    AddAccountController(req, res)
})

router.get('/allLists/:userId', (req, res) => {
    // console.log(req.params['userId']);
    AllListsController(req, res)
})

router.get('/usersEmails/:_id', (req, res) => {
    console.log("resulttt", req.params['_id']);
    UsersEmailsController(req, res)
})

router.post('/addUser', (req, res) => {
    AddUserController(req, res)
})

router.post('/addList', (req, res) => {
    AddListController(req, res)
})

router.delete('/deleteList/:_id', (req, res) => {
    // console.log("user req.params: ", req.params['_id']);
    DeleteListController(req, res)
})

router.delete('/deleteAccount/:_id', (req, res) => {
    console.log("user req.params: ", req.params['_id']);
    DeleteAccountController(req, res)
})


router.post('/sendEmail', (req, res) => {
    SendEmailController(req, res)
})


module.exports = router;