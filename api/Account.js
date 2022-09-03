const express = require('express');
const router = express.Router();


const { MailAccountsController, AddAccountController, DeleteAccountController } = require('../controller/accounts.controller')

router.get('/mailAccounts/:userId', (req, res) => {
    MailAccountsController(req, res)
})

router.post('/addAccount', (req, res) => {
    AddAccountController(req, res)
})

router.delete('/deleteAccount/:_id', (req, res) => {
    DeleteAccountController(req, res)
})


module.exports = router;

