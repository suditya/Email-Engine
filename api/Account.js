const express = require('express');
const router = express.Router();


const { MailAccountsController, AddAccountController, DeleteAccountController } = require('../controller/accounts.controller')

router.get('/mailAccounts/:userId', (req, res) => {
    console.log("wehdgs", req.params['userId'])
    MailAccountsController(req, res)
})

router.post('/addAccount', (req, res) => {
    AddAccountController(req, res)
})

router.delete('/deleteAccount/:_id', (req, res) => {
    console.log("user req.params: ", req.params['_id']);
    DeleteAccountController(req, res)
})


module.exports = router;

