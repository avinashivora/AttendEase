const User = require('../models/user')
const fs = require('fs')
const { generateRandomString } = require("./generateRandomString")
const nodeMailer = require('nodemailer')
const { checkLimit, incMail } = require('../middleware/mailRestricter')
const mongoose = require("mongoose")
const csv = require("csvtojson")
const Students = require("../models/studentsSchema")

const { appendFileSync } = require('fs');
const origConsole = globalThis.console;
const saveConsole = {
    log: (...args) => {
        appendFileSync('./Students_Login_Creds.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

const skipLogin = {
    log: (...args) => {
        appendFileSync('./StudentSkipped.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

console.log("Hello World!");
console.log(`email: ${`another line`}, Password:${`yet another line`}`);

require("dotenv").config({
    path: "./../.env"
})

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log("Connected")
}).catch(err => {
    console.log(err)
})
// Student datas to add: FY_CS,FY_IT,SY_IT,TY_ITH
// Others, batch confirmation remaining
// Changes in course data too

//new data added: FY_DS, Part1_CS and Part1_IT

// const jsonFilePath = '../productionData/dummyMail.json'
const csvFilePath = "../productionData/finalOddSemData/uploadData1.csv"

// const adminData = JSON.parse(fs.readFileSync(jsonFilePath))

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'developercell.sksc@somaiya.edu',
        pass: process.env.MAIL_SECRET,
    }
});

csv().fromFile(csvFilePath).then(async (jsonObj) => {
    let jsonData = jsonObj
    // console.log(jsonData)

    jsonData = jsonData.map(data => {
        // console.log(data)
        return {
            ...data,
            email: data.email.toLowerCase(),
            name: `${data.firstName} ${data.middleName} ${data.lastName}`,
            subjects: data.subjects.slice(1, -1).split(",").map(subject => subject.trim()),
            subjectType: data.subjectType.slice(1, -1).split(",").map(subjectType => subjectType.trim()),
            batch: data.batch.slice(1, -1).split(",").map(batch => batch * 1)
        }
    })

    i = 0

    // const students = await Students.create(jsonData)
    // Assuming jsonData is an array of student objects

    const createdStudents = []; // Array to store created students

    for (const studentData of jsonData) {
        const existingStudent = await Students.findOne({
            seatNumber: studentData.seatNumber,
            // Add other properties as needed for comparison (e.g., email)
        });

        if (!existingStudent) {
            // Student doesn't exist, so create a new one
            const newStudent = await Students.create(studentData);
            createdStudents.push(newStudent); // Add the created student to the array
            console.log(`Added new student: ${newStudent.name}`);
        } else {
            // Student already exists, so skip adding
            skipLogin.log(`Skipping existing student: ${existingStudent.name}, Email: ${existingStudent.email}`);
        }
    }

    // createdStudents now contains an array of newly created students
    console.log('Created students:', createdStudents);

    const userData = createdStudents.map((student) => {
        //random password generated , add this instead of somaiya in below return 
        const randomPassword = generateRandomString(8)
        console.log({ studentEmail: student.email, randomPassword })
        const [firstName, middleName, lastName] = student.name.split(" ");

        return {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: student.email,
            studentId: student._id,
            role: 0,
            password: randomPassword
        }
    })
    console.log("Students Data imported")
    while (i < userData.length) {
        console.log(i === userData.length)

        if (await checkLimit()){
            console.log("Mail service limit exceeded!")
            console.log("Last user added: ",userData[i-1].email);
            break
        }
        
        const user = await User.create({
            firstName: userData[i].firstName,
            middleName: userData[i].middleName,
            lastName: userData[i].lastName,
            email: userData[i].email,
            studentId: userData[i].studentId,
            role: 0,
            password: userData[i].password
        })

        saveConsole.log(`Email: ${user.email} Password: ${user.password}`)

        const mailOptions = {
            from: 'developercell.sksc@somaiya.edu',
            to: user.email,
            subject: 'Introducing AttendEase: Your New Attendance System',
            text: `
              Dear ${user.firstName} ${user.lastName},
              
              We are the **Developer Cell** of S.K. Somaiya College, Somaiya Vidyavihar University. Our mission is to develop innovative solutions to address the challenges faced by the college community.
              
              We feel immense pride to introduce you to one such solution that we have successfully designed and developed - **AttendEase, the official attendance system of our college**. It is now going to be implemented for all the academic courses provided by our college starting with the Majors courses.
              
              **AttendEase** is a user-friendly online platform that allows faculty and staff to efficiently record student attendance. The application utilizes geolocation to verify a student's presence within the designated learning area. **AttendEase** is compatible with Android and iOS devices.
              
              For **Android** users, the application can be installed directly on your mobile device following a simple installation process. The Google Drive link below includes the **APK download file** supporting the Android platform, along with a comprehensive user manual that provides step-by-step instructions on downloading, installing, and using the AttendEase application.
              
              For **iOS** users, the application will shortly be available on the **App Store** or **Drive link** given below.
              
              We urge you to go through the **User Manual** thoroughly that has been put together for your **enhanced User Experience**.
              
              We encourage you to explore the app and familiarize yourself with its features.
              
              **Note**: This link can only be accessed by users with a valid Somaiya email-id.
              **Drive link:** https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing
              
              Your Login credentials for the application are as follows:
              **Email**: ${user.email}
              **Password**: ${user.password}
              
              We believe that **AttendEase** will prove to be significantly effective for the attendance tracking process and save valuable time for both students and teachers.
              
              For any technical assistance or your personal data-related issues within the application, please contact the Developer Cell: developercell.sksc@somaiya.edu
              
              **Join the Developer Cell on our Official Discord Community Server!**
              
              _Stay updated with all our latest events, news, and exciting developments. Our Discord server is the perfect platform for developers to connect with peers, seek assistance, and offer guidance to fellow community members._
              
              https://discord.gg/9mCpYtHVH5
              
              Thank you for your cooperation.
              
              Sincerely,
              The Developer Cell,
              S.K. Somaiya College,
              Somaiya Vidyavihar University
              `,
            html: `
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>We are the <b>Developer Cell</b> of S.K. Somaiya College, Somaiya Vidyavihar University. Our mission is to develop innovative solutions to address the challenges faced by the college community.</p>
            <p>We feel immense pride to introduce you to one such solution that we have successfully designed and developed - <b>AttendEase, the official attendance system of our college</b>. It is now going to be implemented for all the academic courses provided by our college starting with the Majors courses.</p>
            <p><b>AttendEase</b> is a user-friendly online platform that allows faculty and staff to efficiently record student attendance. The application utilizes geolocation to verify a student's presence within the designated learning area. <b>AttendEase</b> is compatible with <b>Android and iOS devices</b>.</p>
            <p>For <b>Android</b> users, the application can be installed directly on your mobile device following a simple installation process. The Google Drive link below includes the <b>APK download file</b> supporting the Android platform, along with a comprehensive user manual that provides step-by-step instructions on downloading, installing, and using the <b>AttendEase</b> application.</p>
            <p>For <b>iOS</b> users, the application will shortly be available on the <b>App Store</b> or <b>Drive link</b> given below.</p>
            <p>We urge you to go through the <b>User Manual</b> thoroughly that has been put together for your <b>enhanced User Experience</b>.</p>
            <p>We encourage you to explore the app and familiarize yourself with its features.</p>
            <p><b>Note:</b> This link can only be accessed by users with a valid Somaiya email-id.<br>
            <b>Drive link:</b> <a href="https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing">https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing</a></p>
            <p>Your Login credentials for the application are as follows:<br>
            <b>Email:</b> ${user.email}<br>
            <b>Password:</b> ${user.password}</p>
            <p>We believe that <b>AttendEase</b> will prove to be significantly effective for the attendance tracking process and save valuable time for both students and teachers.</p>
            <p>For any technical assistance or your personal data-related issues within the application, please contact the <b>Developer Cell</b>: <a href="mailto:developercell.sksc@somaiya.edu">developercell.sksc@somaiya.edu</a></p>
            <p><b>Join the Developer Cell on our Official Discord Community Server!</b></p>
            <p><b>Stay updated with all our latest events, news, and exciting developments. Our Discord server is the perfect platform for developers to connect with peers, seek assistance, and offer guidance to fellow community members.</b></p>
            <p><a href="https://discord.gg/9mCpYtHVH5">https://discord.gg/9mCpYtHVH5</a></p>
            <p>Thank you for your cooperation.</p>
            <p>Sincerely,<br>
            The Developer Cell,<br>
            S.K. Somaiya College,<br>
            Somaiya Vidyavihar University</p>
          `
          };

        transporter.sendMail(mailOptions)
        .then(async(info) => {
            console.log(`Email sent to ${user.firstName}: ` + info.response);    
            const updatedUser = await User.findByIdAndUpdate(user._id,{sentMail:true})
            if(updatedUser){
                console.log("User updated")
            }
            await incMail();
        })
        .catch(error => {
            console.error(`Error sending email for ${user.firstName}: ${error.message}`);
        });

        await new Promise(resolve => setTimeout(resolve, 10000));

        i++
        console.log(i, userData.length)
    }
    process.exit();

})
