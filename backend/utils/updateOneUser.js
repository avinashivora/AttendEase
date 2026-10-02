const mongoose = require("mongoose")
const Students = require("../models/studentsSchema")
const Users = require("./../models/user")
const { generateRandomString } = require("./generateRandomString")
const nodeMailer = require('nodemailer')

require("dotenv").config({
    path : "./../.env"
})

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log("Connected")
}).catch(err => {
    console.log(err)
})

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'developercell.sksc@somaiya.edu',
        pass: process.env.MAIL_SECRET,
    }
});

const update = async() => {
    let oldEmail = 'riya06@somaiya.edu'
    let updatedEmail = 'riya.panchal1@somaiya.edu'
    let newPassword = generateRandomString(8)
    const user = await Users.findOne({email: oldEmail})
    Users.findOneAndUpdate({email: oldEmail}, {$set: {email: updatedEmail, hashed_password: user.encryptPassword(newPassword)}}, {new: true}).then(res => {
        if (res === null) {
            console.log('NO Users Found')
        } else {
            console.log('User Update: ',res)
            Students.findOneAndUpdate({email: oldEmail}, {$set: {email: updatedEmail}}, {new: true}).then(res => {
                if (res === null) {
                    console.log('Cannot Update')
                } else {
                    console.log('Student Update: ',res)
                    console.log({updatedEmail, newPassword})
                    const mailOptions = {
                        from: 'developercell.sksc@somaiya.edu',
                        to: updatedEmail,
                        subject: 'Updated Credentials For AttendEase Beta Testing', // Subject line
                        text: `Greetings from Developer Cell of S.K. Somaiya College.\n\nWe have launched the Attendance Portal - AttendEase-Beta Testing version.\n\nThe website URL is {URL_Link}.\n\nThe updated details for your login to AttendEase are given below:\n\nUser Name:\nPassword:\n\nDetails of how to use it will be shared by respective faculty members in due course of time.`, // Plain text body
                        html: `<p>Greetings from Developer Cell of S.K. Somaiya College.</p>
                               <p>We have launched the Attendance Portal - AttendEase-Beta Testing version.</p>
                               <p>The website URL is <a href="https://192.168.246.211:7000">https://192.168.246.211:7000/</a>.</p>
                               <p>The updated details for your login to AttendEase are given below:</p>
                               <p><b>User Email: ${updatedEmail}</b></p>
                               <p><b>Password: ${newPassword}</b></p>
                               <p>Details of how to use it will be shared by respective faculty members in due course of time.</p>` // HTML body
                    };
            
                     transporter.sendMail(mailOptions)
                     .then(async(info) => {
                         console.log(`Email sent to ${user.firstName}: ` + info.response);    
                         const updatedUser = await Users.findByIdAndUpdate(user._id,{sentMail:true})
                         if(updatedUser){
                             console.log("User updated")
                         }
                     })
                     .catch(error => {
                         console.error(`Error sending email for ${user.firstName}: ${error.message}`);
                     });
                }
            })
        }
    })
}


update()