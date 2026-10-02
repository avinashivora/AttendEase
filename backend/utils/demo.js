// const User = require('../models/user')
// const fs = require('fs')
// const { generateRandomString } = require("./generateRandomString")
// const nodeMailer = require('nodemailer')
// const mongoose = require("mongoose")

// require("dotenv").config({
//     path: "./../.env"
// })

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
//     console.log("Connected")
// }).catch(err => {
//     console.log(err)
// })

// const jsonFilePath = '../productionData/dummyMail.json'

// const adminData = JSON.parse(fs.readFileSync(jsonFilePath))

// const transporter = nodeMailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'mp06121@gmail.com',
//         pass: 'nmwbgjhsdmnqyeck',
//     }
// });


// const func = async() =>{
// i= 0 
// while (i < adminData.length){
        
//            const user = await User.create({
//             firstName: adminData[i].name,
//             middleName: adminData[i].name,
//             lastName: adminData[i].name,
//             email: adminData[i].email,
//             role: 2,
//             password: generateRandomString(8)
//             })

//         console.log(user.email)
            
//         const mailOptions = {
//             from: 'mp06121@gmail.com',
//             to: user.email,
//             subject: 'Account Credentials',
//             text: `Hello ${user.firstName},\n\nYour username is: ${user.email}\nYour password is: ${user.password}`
//         };


//         transporter.sendMail(mailOptions)
//         .then(async(info) => {
//             console.log(`Email sent to ${user.name}: ` + info.response);    
//             const updatedUser = await User.findByIdAndUpdate(user._id,{sentMail:true})
//             if(updatedUser){
//                 console.log("User updated")
//             }
//         })
//         .catch(error => {
//             console.error(`Error sending email for ${user.name}: ${error.message}`);
//         });
        
//         await new Promise(resolve => setTimeout(resolve, 10000));

//         i+=1
//     }
// }

// func()

const { appendFileSync } = require('fs');
const origConsole = globalThis.console;
const console = {
    log: (...args) => {
        appendFileSync('./logresults.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

console.log("Hello World!");
console.log(`email: ${`another line`}, Password:${`yet another line`}`);