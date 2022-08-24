const List = require('../models/List');
const MailAccount = require('../models/MailAccount')
const UserEmail = require('../models/UsersEmail')



const UsersEmailsController = async (req, res) => {

    try {
        // console.log("alllist userId", req.params.listId)

    await UserEmail.find({ userId: req.params['_id'] }).then((result) => {
        // console.log( req.params['listId'] );
        console.log("object", result);
        res.json({
            status: "SUCCESS",
            data: result
        })
    }).catch((error) => {
        console.log("error", error);
        res.json({
            status: "FAILED",
            message: error
        })
    })
    } catch (error) {
        console.log("error", error);
    }

}

const AllListsController = async (req, res) => {
    try {
        // console.log("all list userId", req.params);
        List.find({ userId: req.params['userId'] }).then((data) => {
            // console.log("result ye he: ", data)
            if (data.length == 0) {
                res.json({
                    message: "No List is there"
                })
            } else {
                res.json({
                    status: "SUCCESS",
                    data: data
                })
            }
        })
    } catch (error) {
        res.json({
            status: "FAILED",
            message: "An error occured while fetching Lists"
        })
    }
}


const AddUserController = async (req, res) => {
    try {
        let { userId, name, email, listName } = req.body

        List.find({ listName, userId }).then((result) => {
            let id = result[0]._id
            console.log("Ye hmaraaaaa he: ", id);

            if (!result.length) {
                res.json({
                    status: "FAILED",
                    message: "You dont have any list. Please add a list first"
                })
            } else {
                List.find({ listName, userId }).then(() => {
                    UserEmail.find({ listName, email }).then((result) => {
                        // console.log("object", result);
                        if (result.length) {
                            res.json({
                                status: "FAILED",
                                message: `Email is already there in ${listName} list`
                            })
                        } else {
                            const newUserEmail = new UserEmail({
                                userId: id,
                                name: name,
                                email: email,
                                listName: listName
                            })
                            newUserEmail.save().then((result) => {
                                res.json({
                                    status: "SUCCESS",
                                    message: "User email has been added successfully"
                                })
                            }).catch((error) => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occured while adding user email"
                                })
                            })
                        }
                    })
                })
            }
        })

        // console.log("abcdefghij", req.params['listName']);

    } catch (error) {
        res.json({
            status: "FAILED",
            message: "An error occured while adding user email"
        })
    }
}

const AddListController = async (req, res) => {
    try {
        let { userId, listName } = req.body;
        // console.log("ejdhbndssdnshsn", userId, listName)
        // console.log("list Name ", listName);
        if (listName === "") {
            res.json({
                status: "FAILED",
                message: "List name can not be empty"
            })
        } else {
            MailAccount.find({ userId }).then((result) => {
                // console.log("ye rhaaaaaaaaaaa result:", result);
                if (result.length == 0) {
                    res.json({
                        status: "FAILED",
                        message: "OOPS, You don't have any account. Please add an account first"
                    })
                } else {
                    try {
                        console.log("ejdhbndssdnshsn", userId, listName)
                        List.find({ userId, listName }).then((result) => {
                            console.log("resufscffdfdlt is: ", result)

                            if (result.length) {
                                res.json({
                                    status: "FAILED",
                                    message: "List name is already there. Please try with different list name"
                                })
                            } else {
                                try {
                                    const newList = new List({
                                        userId: userId,
                                        listName: listName
                                    })
                                    newList.save().then(() => {
                                        res.json({
                                            status: "SUCCESS",
                                            message: "List added successfully."
                                        })
                                    }).catch(() => {
                                        res.json({
                                            status: "FAILED",
                                            message: "Something went wrong !!"
                                        })
                                    })
                                } catch (error) {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occured while adding list"
                                    })
                                }
                            }

                        }).catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while adding list"
                            })
                        })
                    } catch (error) {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while fetching data from all accounts"
                        })
                    }
                }
            })


        }

    } catch (error) {
        res.json({
            status: "FAILED",
            message: "An error occured while checking List"
        })
    }
}

const DeleteListController = async (req, res) => {
    try {
        console.log(req.params['_id']);
        List.find({ _id: req.params['_id'] }).then((result) => {
            // console.log("resulttttttt",result.length)
            // console.log("resulttttttt",result)
            if (!result.length) {
                res.json({
                    status: "FAILED",
                    message: "There is no list with this name"
                })
            } else {
                List.deleteOne({ _id: req.params['_id'] }).then((result) => {
                    res.json({
                        status: "SUCCESS",
                        message: "List has been deleted"
                    })
                }).catch((error) => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while deleting List"
                    })
                })
            }
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: "An error occured while deleting List"
        })
    }
}



module.exports = {
    AllListsController,
    UsersEmailsController,
    AddUserController,
    AddListController,
    DeleteListController,
    

}