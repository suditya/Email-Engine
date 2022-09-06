const schedule = require('node-schedule');
const nodemailer = require('nodemailer');


const ScheduledEmails = require('../models/ScheduledEmail')
const UserEmail = require('../models/UsersEmail')
const Emails = require('../models/ScheduledEmail')
const MailAccount = require('../models/MailAccount')
const List = require('../models/List')



const ScheduledEmailsController = async (req, res) => {
    try {

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            const result = await ScheduledEmails.find({ userId: req.params['userId'] }).sort({
                meetingDate: -1
            })

            if (result.length == 0) {
                throw new Error("No scheduled emails are there")
            }
            else {
                res.send({
                    status: "SUCCESS",
                    data: result
                });
            }
        }
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        });
    }
}

const DeleteMeetingController = async (req,res) => {
    try {
        let userId = req.params['userId']
        await ScheduledEmails.deleteOne({ _id: userId })
        res.send({
            status: "SUCCESS",
            message: "Meeting has been deleted"
        })
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message
        })
    }
}


const SendEmailController = async (req, res) => {
    try {

        let { subject, from, to, description, startTime, endTime, date, reminder, userId } = req.body

        const token = req.headers['authorization']

        if (token == "null") {
            throw new Error("You don't have the access")
        }
        else {
            if (startTime.hours > endTime.hours) {
                throw new Error("Start time should be less then end time")
            }
            else {

                let emailDate = new Date(`${date}T${startTime.hours}:${startTime.minutes}`)

                if (reminder === "Before 1 hour") {
                    emailDate.setMinutes(emailDate.getMinutes() + 1);
                }
                if (reminder === "Before 6 hour") {
                    emailDate.setHours(emailDate.getHours() - 6);
                }
                if (reminder === "Before 12 hour") {
                    emailDate.setHours(emailDate.getHours() - 12);
                }
                if (reminder === "Before 1 day") {
                    emailDate.setHours(emailDate.getHours() - 24);
                }
                console.log(emailDate.toString());
                console.log(new Date().toString());

                if (emailDate.toString() < new Date().toString()) {
                   
                    throw new Error("Select date and time should be greater then today's date and time")
                }
                else {
                    const response = await MailAccount.find({ email: from, userId })

                    let id = response[0].userId
                    let password = response[0].password

                    let emailIds = []

                    const result = await List.find({ listName: to, userId: id })

                    // console.log(result);

                    if (!result.length) {
                        throw new Error("There is no email")
                    }
                    else {
                        let id = result[0]._id;
                        const response = await UserEmail.find({ userId: id })

                        let i = 0;
                        response.forEach(function (response) {
                            emailIds[i] = response.email
                            i++;
                        })
                        // console.log("ye bhi result h",result);
                        if (emailIds.length == 0) {
                            throw new Error(`No email found in ${result[0].listName} List`)
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
                                ScheduleDate: emailDate,
                                description: description,
                            })
                            await newScheduledEmails.save()

                            const result = await Emails.find()

                            let newTransporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: from,
                                    pass: password
                                }
                            })

                            if (reminder === "Immediately") {
                                const mailOptions = {
                                    from: from,
                                    to: emailIds.toString(),
                                    subject: subject,
                                    html: `<p>${description} </p>
                                    <h4>Date: ${date}</h4>
                                    <h4> Time: ${startTime.hours}:${startTime.minutes}-${endTime.hours}:${endTime.minutes}</h4>`
                                };

                                newTransporter.sendMail(mailOptions)

                                schedule.scheduleJob('* * * * * *', () => {

                                    let data = [];

                                    result.forEach(function (response) {

                                        data = response.ScheduleDate
                                        
                                        console.log(data);
                                        console.log(new Date().toString());
                                        console.log("");

                                        if (data === new Date().toString()) {

                                            const mailOptions = {
                                                from: response.from,
                                                to: response.to,
                                                subject: response.subject,
                                                html: `<h1>${response.description} </h1>`
                                            };

                                            newTransporter.sendMail(mailOptions)

                                            // console.log("sent");
                                        }
                                    })
                                    // console.log("I'll execute every time");
                                })
                                res.send({
                                    status: "SUCCESS",
                                    message: "Email sent"
                                })

                            }
                            else {
                                schedule.scheduleJob('* * * * * *', () => {

                                    let data = []

                                    result.forEach(function (response) {

                                        data = response.ScheduleDate

                                        if (data === new Date().toString()) {

                                            const mailOptions = {
                                                from: response.from,
                                                to: response.to,
                                                subject: response.subject,
                                                html: `<h1>${response.description} </h1>`
                                            };

                                            newTransporter.sendMail(mailOptions)

                                            // console.log("sent");
                                        }
                                    })
                                    // console.log("I'll execute every time");
                                })
                                res.send({
                                    status: "SUCCESS",
                                    message: `Email saved in draft. It will automatically send ${reminder} of the meeting`
                                })
                            }


                        }

                    }
                }
            }
        }
    } catch (error) {
        res.send({
            status: "FAILED",
            message: error.message,
        });
    }
}



module.exports = {
    ScheduledEmailsController,
    DeleteMeetingController,
    SendEmailController
}
