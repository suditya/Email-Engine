const User = require('../models/User');
// const MailAccount = require('../models/MailAccount')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const UserOTPVerification = require('../models/UserOTPVerification')
const UserEmail = require('../models/UsersEmail')
const AllEmails = require('../models/AllEmails')
const List = require('../models/List')

require('dotenv').config();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

// transporter.verify((error, success) => {
//     if (error) {
//         // console.log(error);
//     } else {
//         // console.log('ready for messages');
//         // console.log(success);
//     }
// })

const SendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(_id, "ye res h")

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter the <b>${otp}</b> in the app to verify your email address and complete the signup process.</p><p>This code <b>expires in 1 hour</b>.</p>`
        };



        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);


        const newOTPVerification = await new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 36000000,
        })

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: `Verification OTP email sent to ${email}`,
            data: {
                userId: _id,
                email,
            }
        })
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}

const VerifyOtp = async (req, res) => {
    try {
        let { userId, otp } = req.body
        console.log("hdvcshvbds", userId, otp)

        if (!userId || !otp) {
            throw Error("Empty otp details are not allowed")
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
            if (UserOTPVerificationRecords.length <= 0) {
                throw new Error("Account record doesn't exist or has been already verified.")
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId });
                    throw new Error("Code has expired. Please request again");
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        throw new Error("Invalid code passed.")
                    } else {
                        // User.updateOne().then((result) => {
                        //     console.log("update ho gyaaa:",result )
                        // })

                        // localStorage.setItem("userId", userId);

                        // const newMailAccount = new MailAccount({
                        //     userId: userId,
                        //     companyName: "XXXX",
                        //     email: "XXXX",
                        //     password: "XXXX"
                        // });

                        // newMailAccount.save();


                        await User.updateOne({ _id: userId }, { verified: true });
                        await UserOTPVerification.deleteMany({ userId });
                        res.json({
                            status: "VERIFIED",
                            message: "User email verified successfully."
                        })


                    }
                }
            }
        }
    } catch (error) {
        res.json({
            staus: "FAILED",
            message: error.message,
        });
    }
}


const SendOTP = async (req, res) => {
    let { email } = req.body;
    email = email.trim();

    await User.find({ email }, { verified: 1 }).then(result => {
        // console.log(result)
        const _id = result[0]._id;
        // console.log("ye id h", _id)
        if (result[0].verified === true) {
            // console.log("dwkjehgsd")
            res.json({
                status: "FAILED",
                message: "Email id has been already verified !"
            })
        } else {
            // console.log("ruko zaraaaa")
            UserOTPVerification.deleteMany({ userId: _id })
                .then(() => {
                    SendOTPVerificationEmail({ _id, email }, res)
                })

        }
    }).catch(err => {
        // console.log(err);
        res.json({
            status: "FAILED",
            // message: "An error occured while checking for existing user!"
            message: "User doesn't exist. Please signup first !"
        })
    })
}

const SendEmailController = async (req, res) => {
    try {
        let { subject, startTime, endTime, from, to, description } = req.body

        let emailIds = []

        List.find({ listName: to }).then((result) => {
            // console.log(result);
            if (!result.length) {
                res.json({
                    staus: "FAILED",
                    message: `There is no email in ${result[0].listName} `,
                });
            } else {
                let id = result[0]._id;
                // console.log(id);
                UserEmail.find({ userId: id }).then((result) => {
                    result.forEach(function (response) {
                        emailIds += response.email + ","
                    })

                    console.log("object", emailIds);

                    if (!emailIds) {
                        res.json({
                            staus: "FAILED",
                            message: "No email found",
                        });
                    } else {

                        // res.json({
                        //     data: emailIds
                        // });


                        const mailOptions = {
                            from: process.env.AUTH_EMAIL,
                            to: emailIds,
                            subject: subject,
                            html: description
                        };
                        console.log("All Emails:", mailOptions);




                        transporter.sendMail(mailOptions).then(() => {

                            const newAllEmails = new AllEmails({
                                subject: subject,
                                startTime: startTime,
                                endTime: endTime,
                                from: from,
                                to: emailIds,
                                description: description,
                            })

                            newAllEmails.save().then((result) => {
                                console.log("result: ", result);
                                res.json({
                                    staus: "SUCCESS",
                                    message: "Email has been sent",
                                });
                            })
                            
                        }).catch((error) => {
                            console.log("error", error);
                        })

                    }
                })
            }

        })




    } catch (error) {
        res.json({
            staus: "FAILED",
            message: error.message,
        });
    }
}


module.exports = {
    SendOTPVerificationEmail,
    SendOTP,
    VerifyOtp,
    SendEmailController,
}