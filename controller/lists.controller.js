const List = require('../models/List');
const MailAccount = require('../models/MailAccount')
const UserEmail = require('../models/UsersEmail')


const AllListsController = async (req, res) => {
    try {
        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const data = await List.find({ userId: req.params['userId'] })

            if (data.length == 0) {
                throw new Error("No List is there")
            }
            else {
                res.send({
                    status: "SUCCESS",
                    data: data
                })
            }
        }
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}

const UsersEmailsController = async (req, res) => {

    try {

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const result = await UserEmail.find({ userId: req.params['_id'] })

            res.send({
                status: "SUCCESS",
                data: result
            })
        }
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

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const result = await List.find({ listName, userId })

            let _id = result[0]._id

            if (!result.length) {
                throw new Error("You dont have any list. Please add a list first")
            }
            else {
                const result = await UserEmail.find({ userId: _id, email })

                if (result.length) {
                    throw new Error(`Email is already there in ${listName} list`)
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
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}

const AddListController = async (req, res) => {
    try {
        let { userId, listName, description } = req.body;

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const result = await MailAccount.find({ userId })

            if (result.length == 0) {
                throw new Error("OOPS, You don't have any account. Please add an account first")
            }
            else {
                const result = await List.find({ userId, listName })

                if (result.length) {
                    throw new Error("List name is already there. Please try with different list name")
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
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}

const DeleteListController = async (req, res) => {
    try {

        let id = req.params['_id'];

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const result = await List.find({ _id: id })

            if (!result.length) {
                throw new Error("There is no list with this name")
            }
            else {

                await List.deleteOne({ _id: id })
                const result = await UserEmail.find({ userId: id })
                await UserEmail.deleteMany({ userId: id });
                res.send({
                    status: "SUCCESS",
                    message: "List has been deleted"
                })

            }
        }
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

        const token = req.headers['authorization']

        if (token == "null") {
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