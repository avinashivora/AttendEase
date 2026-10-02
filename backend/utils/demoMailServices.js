const nodeMailer = require('nodemailer')
// const { checkLimit, incMail } = require('../middleware/mailRestricter')

// const transporter = nodeMailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     service: 'Gmail',
//     auth: {
//         user: 'mp06121@gmail.com',
//         pass: 'nmwbgjhsdmnqyeck',
//     }
// });

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'developercell.sksc@somaiya.edu',
        pass: process.env.MAIL_SECRET,
    }
});

const mailOptions = {
    from: 'developercell.sksc@somaiya.edu',
    to: 'mihir.p@somaiya.edu',    
    subject: 'Credentials For AttendEase Beta Testing', // Subject line
    text: `Greetings from Developer Cell of S.K. Somaiya College.\n\nWe have launched the Attendance Portal - AttendEase-Beta Testing version.\n\nThe website URL is {URL_Link}.\n\nThe details for your login to AttendEase are given below:\n\nUser Name:\nPassword:\n\nDetails of how to use it will be shared by respective faculty members in due course of time.`, // Plain text body
    html: `<p>Greetings from Developer Cell of S.K. Somaiya College.</p>
    <p>We have launched the Attendance Portal - AttendEase-Beta Testing version.</p>
    <p>The website URL is <a href="https://192.168.246.211:7000">https://192.168.246.211:7000/</a>.</p>
    <p>For Android user we request you to use our Android-Beta release. The download link is given below</p>
    <p>Link for Android Users: <a href="https://drive.google.com/file/d/17aSk7Cj8nMjODBMeZ_8dnJEOkQLbJQ1C/view?usp=sharing">Drive Link</a>.</p>
    <p>The details for your login to AttendEase are given below:</p>
    <p><b>User Email: </b></p>
    <p><b>Password: </b></p>
    <p>Details of how to use it will be shared by respective faculty members in due course of time.</p>` // HTML body

};

// if (checkLimit()){
//     console.log("Mail service limit exceeded!")
// } else {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email:', info.response);
            incMail();
        }
    });
// }