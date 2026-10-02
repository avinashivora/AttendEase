const User = require('../models/user')
const fs = require('fs')
const { generateRandomString } = require("./generateRandomString")
const nodeMailer = require('nodemailer')
const { checkLimit, incMail } = require('../middleware/mailRestricter')
const mongoose = require("mongoose")
require("dotenv").config({
    path: "./../.env"
})

const jsonFilePath = '../archives/dummyMail.json'

const adminData = JSON.parse(fs.readFileSync(jsonFilePath))

console.log(adminData)

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log("Connected")
}).catch(err => {
    console.log(err)
})
const promises = [];

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'developercell.sksc@somaiya.edu',
        pass: process.env.MAIL_SECRET,
    }
});

const userDocuments = adminData.map(user => ({
    firstName: user.name,
    middleName: user.name,
    lastName: user.name,
    email: user.email,
    role: 2,
    password: 'somaiya'
}));

// Use bulkWrite to insert multiple documents
User.create(userDocuments)
    .then(result => {
        console.log(`${userDocuments.length} users created successfully`);

        // Send emails for each user
        userDocuments.forEach(user => {
            const mailOptions = {
                from: 'developercell.sksc@somaiya.edu',
                to: user.email,
                subject: 'Credentials For AttendEase Beta Testing', // Subject line
                text: `Greetings from Developer Cell of S.K. Somaiya College.\n\nWe have launched the Attendance Portal - AttendEase-Beta Testing version.\n\nThe website URL is {URL_Link}.\n\nThe details for your login to AttendEase are given below:\n\nUser Name:\nPassword:\n\nDetails of how to use it will be shared by respective faculty members in due course of time.`, // Plain text body
                html: `<p>Greetings from Developer Cell of S.K. Somaiya College.</p>
                       <p>We have launched the Attendance Portal - AttendEase-Beta Testing version.</p>
                       <p>The website URL is <a href="https://192.168.246.211:7000">https://192.168.246.211:7000/</a>.</p>
                       <p>The details for your login to AttendEase are given below:</p>
                       <p><b>User Email: ${user.email}</b></p>
                       <p><b>Password: ${user.password}</b></p>
                       <p>Details of how to use it will be shared by respective faculty members in due course of time.</p>` // HTML body
            };

            // transporter.sendMail(mailOptions)
            //     .then(info => {
            //         console.log(`Email sent to ${user.name}: ` + info.response);
            //         incMail();
            //     })
            //     .catch(error => {
            //         console.error(`Error sending email for ${user.name}: ${error.message}`);
            //     });
        });
    })
    .catch(error => {
        console.error(`Error creating users: ${error.message}`);
    }).finally(() => {
        mongoose.disconnect();
    });
