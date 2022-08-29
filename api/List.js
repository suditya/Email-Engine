const express = require('express');
const router = express.Router();


const { AddListController, AllListsController, UsersEmailsController, DeleteListController, AddUserController, DeleteUserController } = require('../controller/lists.controller')


router.get('/allLists/:userId', (req, res) => {
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


router.delete('/deleteMember/:_id', (req, res) => {
    console.log("_id", req.params['_id']);
    DeleteUserController(req, res);
})




module.exports = router;