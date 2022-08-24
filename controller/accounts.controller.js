const MailAccount = require('../models/MailAccount')

const MailAccountsController = async (req, res) => {
    try {
        console.log(req.params['userId']);
        MailAccount.find({ userId: req.params['userId']})
            .then(data => {
                console.log("ye dddddata h:", data.length)
                if (data.length == 0) {
                    res.json({
                        message: "No account is there"
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
            message: "An error occured while checking mail accounts"
        })
    }
}

const AddAccountController = async (req, res) => {
    try {
        let { companyName, email, password, userId } = req.body;

        userId: userId.trim();
        companyName = companyName.trim();
        email = email.trim();
        password = password.trim();

        MailAccount.find({ email }).then((result) => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with this email id is already exist"
                })
            } else {
                const newAddAccount = new MailAccount({
                    userId: userId,
                    companyName: companyName,
                    email: email,
                    password: password
                })
                newAddAccount.save().then((result) => {
                    res.json({
                        status: "Success",
                        message: "Account added successfully"
                    })
                }).catch((error) => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while adding account!"
                    })
                })
            }
        })



    } catch (error) {
        res.json({
            status: "FAILED",
            message: "User with this email id is already exist"
        })
    }
}

const DeleteAccountController = async (req, res) => {
    try {
        console.log(req.params['_id']);
        MailAccount.find({ _id: req.params['_id'] }).then((result) => {
            // console.log("resulttttttt",result.length)
            // console.log("resulttttttt",result)
            if (!result.length) {
                res.json({
                    status: "FAILED",
                    message: "There is no account with this name"
                })
            } else {
                MailAccount.deleteOne({ _id: req.params['_id'] }).then((result) => {
                    res.json({
                        status: "SUCCESS",
                        message: "Account has been deleted"
                    })
                }).catch((error) => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while deleting account"
                    })
                })
            }
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: "An error occured while deleting account"
        })
    }
}

module.exports = {
    MailAccountsController,
    AddAccountController,
    DeleteAccountController
}