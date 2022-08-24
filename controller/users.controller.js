const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


const { SendOTPVerificationEmail } = require("./verification.controller")

const SignupController = async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    // console.log(name),
    // console.log(email)

    User.find({ email }).then(result => {
        // console.log("result aa gya: ", result)
        if (result.length) {
            res.json({
                status: "FAILED",
                message: "User with this email id is already exist"
            })
        } else {
            const saltRounds = 10
            bcrypt.hash(password, saltRounds).then(hashedPassword => {

                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    verified: false
                });

                newUser.save()
                    .then((result) => {
                        SendOTPVerificationEmail(result, res);
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account!"
                        })
                    })
            })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
        }
    }).catch(err => {
        // console.log(err);
        res.json({
            status: "FAILED",
            message: "An error occured while checking for existing user!"
        })
    })
}


const SigninController = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    console.log("email and pass is: ", email, password)

    User.find({ email })
        .then(data => {
            // console.log("data he: ", data[0].verified)
            if (data.length) {
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "Email has not been verified yet",
                        data: data[0].verified
                    })
                } else {
                    console.log("yha tk thk h sb")



                    console.log("khaa gyiii")
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {

                            const claims = {
                                email: email
                            }

                            jwt.sign(claims, process.env.JWT_KEY, function (error, token) {
                                if (error) {
                                    res.json({
                                        status: "FAILED",
                                        message: "Error occured while checking token"
                                    })
                                } else {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Singin Successful",
                                        authToken: token,
                                        data: data,
                                        email: data[0].email,
                                        userId: data[0]._id
                                    })
                                }
                            })

                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered",
                            })
                        }
                    })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while comapring password",
                            })
                        })
                }

            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!",
                })
            }
        })
        .catch((err => {
            res.json({
                status: "FAILED",
                message: "Email i'd doesn't exist. Please Register first"
            })
        }))
}

module.exports = {
    SigninController,
    SignupController,
}

