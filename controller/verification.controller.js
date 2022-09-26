const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const User = require('../models/User');
const UserOTPVerification = require('../models/UserOTPVerification');



require('dotenv').config();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

const SendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter the <b>${otp}</b> in the app to verify your email address and complete the signup process.</p><p>This otp will <b>expire in 1 hour</b>.</p>`
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.status(202).send({
            status: "PENDING",
            message: `Verification OTP email sent to ${email}`,
            data: {
                userId: _id,
                email,
            }
        })

    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message
        })
    }
}


const ReSendOTPController = async (req, res) => {
    try {
        let { email } = req.body;

        const result = await User.find({ email }, { verified: 1 })

        if (result.length == 0) {
            res.status(401).json({
                message: "User doesn't exist. Please signup first !"
            })
        }
        else if (result[0].verified === true) {
            res.status(401).json({
                message: "Email id has been already verified !"
            })
        }
        else {
            const _id = result[0]._id;
            await UserOTPVerification.deleteMany({ userId: _id })
            await SendOTPVerificationEmail({ _id, email }, res)
        }
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message,
        })
    }
}


const VerifyOtpController = async (req, res) => {
    try {
        let { userId, otp } = req.body

        console.log(userId, otp);

        if (!userId || !otp) {
            res.status(401).json({
                message: "Empty otp details are not allowed"
            })
        }
        else {
            const result = await UserOTPVerification.findOne({ userId })
            console.log("result", result);

            if (result.length <= 0) {
                res.status(401).json({
                    message: "Account record doesn't exist or has been already verified"
                })
            }

            else {
                const { expiresAt } = result;
                const hashedOTP = result.otp;

                if (expiresAt < Date.now()) {
                    UserOTPVerification.deleteMany({ userId });

                    res.status(401).json({
                        status: "FAILED",
                        message: "Code has expired. Please request again"
                    })
                }

                else {
                    const response = await bcrypt.compare(otp, hashedOTP);

                    if (!response) {
                        res.status(401).json({
                            staus: "FAILED",
                            message: "Invalid OTP"
                        })
                    }

                    else {
                        await User.updateOne({ _id: userId }, { verified: true })
                        await UserOTPVerification.deleteMany({ userId })

                        res.send({
                            status: "VERIFIED",
                            message: "User email verified successfully."
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message,
        })
    }
}



module.exports = {
    SendOTPVerificationEmail,
    ReSendOTPController,
    VerifyOtpController,
}