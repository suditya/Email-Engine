const express = require('express');
const router = express.Router();


const { AddListController, AllListsController, UsersEmailsController, DeleteListController, AddUserController, DeleteUserController } = require('../controller/lists.controller')


router.get('/allLists/:userId', (req, res) => {
    AllListsController(req, res)
})


router.get('/usersEmails/:_id', (req, res) => {
    UsersEmailsController(req, res)
})


router.post('/addUser', (req, res) => {
    AddUserController(req, res)
})


router.post('/addList', (req, res) => {
    AddListController(req, res)
})


router.delete('/deleteList/:_id', (req, res) => {
    DeleteListController(req, res)
})


router.delete('/deleteMember/:_id', (req, res) => {
    DeleteUserController(req, res);
})




module.exports = router;