const jwt = require('jsonwebtoken')
const MailAccount = require('../models/MailAccount')


const MailAccountsController = async (req, res) => {
    try {
        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    message: "You don't have the access"
                })
            }
            else {
                const data = await MailAccount.find({ userId: req.params['userId'] })

                if (data.length == 0) {
                    res.status(401).json({
                        message: "No account is there"
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

const AddAccountController = async (req, res) => {
    try {

        let { companyName, email, password, userId } = req.body;

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    message: "You don't have the access"
                })
            }
            else {
                const result = await MailAccount.find({ email, userId })

                if (result.length) {
                    res.status(401).json({
                        message: "Account with this email id is already exist"
                    })
                }
                else {
                    const newAddAccount = new MailAccount({
                        userId: userId,
                        companyName: companyName,
                        email: email,
                        password: password
                    })

                    await newAddAccount.save();

                    res.send({
                        status: "Success",
                        message: "Account added successfully"
                    })
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message
        })
    }
}

const DeleteAccountController = async (req, res) => {
    try {

        let id = req.params['_id'];

        let token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    message: "You don't have the access"
                })
            }
            else {
                await MailAccount.deleteOne({ _id: id })

                res.send({
                    status: "SUCCESS",
                    message: "Account has been deleted"
                })
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message
        })
    }
}

module.exports = {
    MailAccountsController,
    AddAccountController,
    DeleteAccountController
}