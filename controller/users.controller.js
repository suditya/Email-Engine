const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


const { SendOTPVerificationEmail } = require("./verification.controller")


const SignupController = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        const result = await User.find({ email })

        if (result.length) {
            throw new Error("User with this email id is already exist")
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

            await newUser.save();  //await User.insertMany(newUser);
            await SendOTPVerificationEmail(newUser, res);
        }
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}


const SigninController = async (req, res) => {
    try {
        let { email, password } = req.body;

        const data = await User.find({ email })

        if (data.length == 0) {
            throw new Error("Email i'd doesn't exist. Please Register first")
        }
        else if (!data[0].verified) {
            throw new Error("Email has not been verified yet")
        }
        else {
            const hashedPassword = data[0].password;
            const result = await bcrypt.compare(password, hashedPassword);

            if (result) {
                const claims = {
                    email: email
                }

                const token = await jwt.sign(claims, process.env.JWT_KEY)

                res.send({
                    status: "SUCCESS",
                    message: "Singin Successful",
                    authToken: token,
                    data: data,
                    email: data[0].email,
                    userId: data[0]._id
                })
            }
            else {
                throw new Error("Invalid credentials entered")
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
    SigninController,
    SignupController,
}

