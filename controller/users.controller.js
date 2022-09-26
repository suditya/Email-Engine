const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


const { SendOTPVerificationEmail } = require("./verification.controller")


const SignupController = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        const result = await User.find({ email })

        if (result.length) {
            res.status(401).json({
                status: "SUCCESS",
                message: "User with this email id is already exist"
            })
        }
        else {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                verified: false
            });

            await newUser.save();
            await SendOTPVerificationEmail(newUser, res);
        }
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message
        })
    }
}


const SigninController = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!(email && password)) {
            res.status(401).json({
                message: "Empty details are not allowed"
            })
        }

        else {
            const data = await User.findOne({ email })

            if (data.length == 0) {
                res.status(401).json({
                    message: "Email i'd doesn't exist. Please Register first"
                })
            }
            else if (!data.verified) {
                res.status(401).json({
                    message: "Email has not been verified yet"
                })
            }
            else {
                const hashedPassword = data.password;
                const result = await bcrypt.compare(password, hashedPassword);

                if (result) {
                    const claims = {
                        email: email
                    }

                    const token = await jwt.sign(claims, process.env.JWT_KEY)

                    res.send({
                        message: "Singin Successful",
                        authToken: token,
                        email: data.email,
                        userId: data._id
                    })
                }
                else {
                    res.status(401).json({
                        message: "Invalid credentials entered"
                    })
                }
            }
        }
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }
}

module.exports = {
    SigninController,
    SignupController,
}

