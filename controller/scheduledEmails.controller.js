const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const ScheduledEmails = require('../models/ScheduledEmail')
const UserEmail = require('../models/UsersEmail')
const Emails = require('../models/ScheduledEmail')
const MailAccount = require('../models/MailAccount')
const List = require('../models/List');



const ScheduledEmailsController = async (req, res) => {
    try {
        const token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                const result = await ScheduledEmails.find({ userId: req.params['userId'], tag: "Everyone" }).sort({
                    meetingDate: -1,
                    startTime: -1
                })

                if (result.length == 0) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "No scheduled emails are there"
                    })
                }
                else {
                    res.send({
                        status: "SUCCESS",
                        data: result
                    });
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



const ScheduledIndividualEmailsController = async (req, res) => {
    try {

        const token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                const result = await ScheduledEmails.find({ userId: req.params['userId'], tag: "Individual" }).sort({
                    meetingDate: -1,
                    startTime: -1
                })

                if (result.length == 0) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "No scheduled emails are there"
                    })
                }
                else {
                    res.send({
                        status: "SUCCESS",
                        data: result
                    });
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


const DeleteMeetingController = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        let userId = req.params['userId']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                await ScheduledEmails.deleteOne({ _id: userId })
                res.send({
                    status: "SUCCESS",
                    message: "Meeting has been deleted"
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


const SendEmailController = async (req, res) => {
    try {

        let { subject, from, to, description, startTime, endTime, date, reminder, userId } = req.body

        let textArray = description.split(/^/gm)


        let descriptionPara = "";

        for (let i = 0; i < textArray.length - 1; i++) {
            let res = deleteLast2chars(textArray[i]);
            let newPara = `<p>${res}</p>`;
            descriptionPara += newPara
        }

        let lastPara = `<p>${textArray[textArray.length - 1]}</p>`
        descriptionPara += lastPara

        function deleteLast2chars(sentence) {
            return sentence.slice(0, -1);
        }

        const token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                if (startTime.hours > endTime.hours || (startTime.hours === endTime.hours && startTime.minutes > endTime.minutes)) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "Start time must be less than end time"
                    })
                }
                else {

                    let emailDate = new Date(`${date}T${startTime.hours}:${startTime.minutes}`)

                    if (emailDate < new Date()) {
                        res.status(401).json({
                            status: "FAILED",
                            message: "Select date and time must be greater than today's date and time"
                        })
                    }

                    else {
                        emailDate.setHours(emailDate.getHours() - 5);
                        emailDate.setMinutes(emailDate.getMinutes() - 30);

                        if (reminder === "Before 1 hour of the meeting") {
                            emailDate.setMinutes(emailDate.getMinutes() + 1);
                        }
                        if (reminder === "Before 6 hours of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 6);
                        }
                        if (reminder === "Before 12 hours of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 12);
                        }
                        if (reminder === "Before 1 day of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 24);
                        }
                        else {

                            const response = await MailAccount.find({ email: from, userId })

                            let id = response[0].userId
                            let password = response[0].password

                            let emailIds = []

                            const result = await List.find({ listName: to, userId: id })


                            if (!result.length) {
                                res.status(401).json({
                                    status: "FAILED",
                                    message: "There is no email"
                                })
                            }
                            else {
                                let id = result[0]._id;
                                const response = await UserEmail.find({ userId: id })

                                let i = 0;
                                response.forEach(function (response) {
                                    emailIds[i] = response.email
                                    i++;
                                })
                                if (emailIds.length == 0) {
                                    res.status(401).json({
                                        status: "FAILED",
                                        message: `No email found inside ${result[0].listName} List`
                                    })
                                }
                                else {

                                    if (reminder === "Immediately") {

                                        let newTransporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                user: from,
                                                pass: password
                                            }
                                        })

                                        const mailOptions = {
                                            from: from,
                                            to: emailIds.toString(),
                                            subject: subject,
                                            html: `${descriptionPara}
                                            <h4>Date: ${date}</h4>
                                            <h4> Time: ${startTime.hours}:${startTime.minutes}-${endTime.hours}:${endTime.minutes}</h4>`
                                        };

                                        newTransporter.sendMail(mailOptions).then(async () => {

                                            const newScheduledEmails = new ScheduledEmails({
                                                userId: userId,
                                                subject: subject,
                                                from: from,
                                                to: emailIds.toString(),
                                                meetingDate: date,
                                                startTime: `${startTime.hours}:${startTime.minutes}`,
                                                endTime: `${endTime.hours}:${endTime.minutes}`,
                                                scheduleDate: emailDate.toISOString(),
                                                description: descriptionPara,
                                                sent: "Yes",
                                                tag: "Everyone"
                                            })
                                            await newScheduledEmails.save()
                                            res.send({
                                                status: "SUCCESS",
                                                message: "Email sent"
                                            })
                                        }).catch(() => {
                                            res.status(401).json({
                                                status: "FAILED",
                                                message: "Email and Password is wrong"
                                            })
                                        })
                                    }
                                    else {
                                        const newScheduledEmails = new ScheduledEmails({
                                            userId: userId,
                                            subject: subject,
                                            from: from,
                                            to: emailIds.toString(),
                                            meetingDate: date,
                                            startTime: `${startTime.hours}:${startTime.minutes}`,
                                            endTime: `${endTime.hours}:${endTime.minutes}`,
                                            scheduleDate: emailDate.toISOString(),
                                            description: descriptionPara,
                                            sent: "InProcess",
                                            tag: "Everyone"
                                        })
                                        await newScheduledEmails.save()

                                        await checkEmailEverySecond();

                                        res.send({
                                            status: "SUCCESS",
                                            message: `Email saved in draft. It will automatically send ${reminder}`
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message,
        })
    }
}



const SendEmailIndividualController = async (req, res) => {
    try {

        let { subject, from, to, description, startTime, endTime, date, reminder, userId } = req.body



        let textArray = description.split(/^/gm)

        let descriptionPara = "";

        for (let i = 0; i < textArray.length - 1; i++) {
            let res = deleteLast2chars(textArray[i]);
            let newPara = `<p>${res}</p>`;
            descriptionPara += newPara
        }

        let lastPara = `<p>${textArray[textArray.length - 1]}</p>`
        descriptionPara += lastPara

        function deleteLast2chars(sentence) {
            return sentence.slice(0, -1);
        }

        const token = req.headers['authorization']

        await jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) {
                res.status(401).json({
                    status: "FAILED",
                    message: "You don't have the access"
                })
            }
            else {
                if (startTime.hours > endTime.hours || (startTime.hours === endTime.hours && startTime.minutes > endTime.minutes)) {
                    res.status(401).json({
                        status: "FAILED",
                        message: "Start time must be less than end time"
                    })
                }
                else {

                    let emailDate = new Date(`${date}T${startTime.hours}:${startTime.minutes}`)

                    if (emailDate < new Date()) {
                        res.status(401).json({
                            status: "FAILED",
                            message: "Select date and time must be greater than today's date and time"
                        })
                    }

                    else {
                        emailDate.setHours(emailDate.getHours() - 5);
                        emailDate.setMinutes(emailDate.getMinutes() - 30);

                        if (reminder === "Before 1 hour of the meeting") {
                            emailDate.setMinutes(emailDate.getMinutes() + 1);
                        }
                        if (reminder === "Before 6 hours of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 6);
                        }
                        if (reminder === "Before 12 hours of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 12);
                        }
                        if (reminder === "Before 1 day of the meeting") {
                            emailDate.setHours(emailDate.getHours() - 24);
                        }
                        else {

                            const response = await MailAccount.find({ email: from, userId })

                            let password = response[0].password


                            if (reminder === "Immediately") {

                                let newTransporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: from,
                                        pass: password
                                    }
                                })

                                const mailOptions = {
                                    from: from,
                                    to: to,
                                    subject: subject,
                                    html: `${descriptionPara}
                                    <h4>Date: ${date}</h4>
                                    <h4> Time: ${startTime.hours}:${startTime.minutes}-${endTime.hours}:${endTime.minutes}</h4>`
                                };

                                newTransporter.sendMail(mailOptions).then(async () => {

                                    const newScheduledEmails = new ScheduledEmails({
                                        userId: userId,
                                        subject: subject,
                                        from: from,
                                        to: to,
                                        meetingDate: date,
                                        startTime: `${startTime.hours}:${startTime.minutes}`,
                                        endTime: `${endTime.hours}:${endTime.minutes}`,
                                        scheduleDate: emailDate.toISOString(),
                                        description: descriptionPara,
                                        sent: "Yes",
                                        tag: "Individual"
                                    })
                                    await newScheduledEmails.save()

                                    await checkEmailEverySecond();

                                    res.send({
                                        status: "SUCCESS",
                                        message: "Email sent"
                                    })
                                }).catch(() => {
                                    res.status(401).json({
                                        status: "FAILED",
                                        message: "Email and Password is wrong"
                                    })
                                })
                            }
                            else {
                                const newScheduledEmails = new ScheduledEmails({
                                    userId: userId,
                                    subject: subject,
                                    from: from,
                                    to: to,
                                    meetingDate: date,
                                    startTime: `${startTime.hours}:${startTime.minutes}`,
                                    endTime: `${endTime.hours}:${endTime.minutes}`,
                                    scheduleDate: emailDate.toISOString(),
                                    description: descriptionPara,
                                    sent: "InProcess",
                                    tag: "Individual"
                                })
                                await newScheduledEmails.save()

                                await checkEmailEverySecond();

                                res.send({
                                    status: "SUCCESS",
                                    message: `Email saved in draft. It will automatically send ${reminder}`
                                })
                            }
                        }
                    }
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: error.message,
        })
    }
}


async function checkEmailEverySecond() {

    schedule.scheduleJob('* * * * * *', async () => {

        const scheduledEmail = await Emails.find()

        scheduledEmail.forEach(async function (response) {

            let data = response.scheduleDate

            data = new Date(data)

            // data.setHours(data.getHours() + 5);
            // data.setMinutes(data.getMinutes() + 30);

            let _id = response._id

            if (response.sent === "InProcess" && data.toISOString().slice(0, -5) === new Date().toISOString().slice(0, -5)) {

                let email = await Emails.findOne({ _id })

                let { from, to, subject, description, meetingDate, startTime, endTime, userId } = email

                const mailOptions = {
                    from: from,
                    to: to,
                    subject: subject,
                    html: `${description} 
                        <h4>Date: ${meetingDate}</h4>
                        <h4> Time: ${startTime}-${endTime}</h4>`
                };

                const result = await MailAccount.findOne({ userId, email: from })

                let newTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: result.email,
                        pass: result.password
                    }
                })

                const update = await Emails.updateOne({ _id }, { sent: "yes" })

                if (update.modifiedCount === 1) {
                    await newTransporter.sendMail(mailOptions)
                }
            }
        })
    })
}


module.exports = {
    ScheduledEmailsController,
    ScheduledIndividualEmailsController,
    DeleteMeetingController,
    SendEmailController,
    SendEmailIndividualController
}