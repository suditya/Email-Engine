const List = require('../models/List');
const MailAccount = require('../models/MailAccount')
const UserEmail = require('../models/UsersEmail')

const jwt = require('jsonwebtoken')


const AllListsController = async (req, res) => {
    try {
        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    message: "You don't have the access"
                })
            }
            else {
                const data = await List.find({ userId: req.params['userId'] })

                if (data.length == 0) {
                    res.status(401).json({
                        message: "No List is there"
                    })
                }
                else {
                    res.send({
                        status: "SUCCESS",
                        data: data
                    })
                }
            }
        })

    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message,
        })
    }
}

const UsersEmailsController = async (req, res) => {

    try {
        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                throw new Error("You don't have the access")
            }
            else {
                const result = await UserEmail.find({ userId: req.params['_id'] })

                res.send({
                    status: "SUCCESS",
                    data: result
                })
            }
        })
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}


const AddUserController = async (req, res) => {
    try {
        let { userId, name, email, listName } = req.body

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                const result = await List.find({ listName, userId })

                let _id = result[0]._id

                if (!result.length) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "You don't have any list. Please add a list first"
                    })
                }
                else {
                    const result = await UserEmail.find({ userId: _id, email })

                    if (result.length) {
                        res.status(401).json({
                            status: "FAILED",
                            message: `Email is already exist inside the ${listName} list`
                        })
                    }
                    else {
                        const newUserEmail = new UserEmail({
                            userId: _id,
                            name: name,
                            email: email,
                            listName: listName
                        })

                        await newUserEmail.save();

                        res.send({
                            status: "SUCCESS",
                            message: "User email has been added successfully"
                        })
                    }
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message,
        })
    }
}

const AddListController = async (req, res) => {
    try {
        let { userId, listName, description } = req.body;

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    message: "You don't have the access"
                })
            }
            else {
                const result = await MailAccount.find({ userId })

                if (result.length == 0) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "OOPS, You don't have any account. Please add an account first"
                    })
                }
                else {
                    const result = await List.find({ userId, listName })

                    if (result.length) {
                        res.status(401).json({
                            status: "FAILED",
                            message: "List name is already there. Please try with different list name"
                        })
                    }
                    else {
                        const newList = new List({
                            userId: userId,
                            listName: listName,
                            description: description
                        })

                        await newList.save();

                        res.send({
                            status: "SUCCESS",
                            message: "List added successfully."
                        })
                    }
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message,
        })
    }
}

const DeleteListController = async (req, res) => {
    try {

        let id = req.params['_id'];

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                throw new Error("You don't have the access")
            }
            else {
                const result = await List.find({ _id: id })

                if (!result.length) {
                    throw new Error("There is no list with this name")
                }
                else {
                    await List.deleteOne({ _id: id })
                    await UserEmail.find({ userId: id })
                    await UserEmail.deleteMany({ userId: id });

                    res.send({
                        status: "SUCCESS",
                        message: "List has been deleted"
                    })
                }
            }
        })


    }
    catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}

const DeleteUserController = async (req, res) => {
    try {
        let id = req.params['_id']

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                throw new Error("You don't have the access")
            }
            else {
                const result = await UserEmail.find({ _id: id })

                if (result.length == 0) {
                    throw new Error("There is no member with this email")
                }
                else {
                    await UserEmail.deleteOne({ _id: id })

                    res.send({
                        status: "SUCCESS",
                        message: "Member has been deleted"
                    })
                }
            }
        })


    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}


module.exports = {
    AllListsController,
    UsersEmailsController,
    AddUserController,
    AddListController,
    DeleteListController,
    DeleteUserController
}