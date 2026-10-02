const csv = require("csvtojson");
const mongoose = require("mongoose");
const Students = require("../models/studentsSchema");
const Users = require("../models/user");
const fs = require("fs");
const { generateRandomString } = require("./generateRandomString");
const nodeMailer = require("nodemailer");

require("dotenv").config({
  path: "./../.env",
});

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
// Path of the csv file that is to be imported
const csvFilePath = "../productionData/trainingData/trainingstudent.csv";

// const transporter = nodeMailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'developercell.sksc@somaiya.edu',
//         pass: process.env.MAIL_SECRET,
//     }
// });

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    let jsonData = jsonObj;
    // console.log(jsonData)

    jsonData = jsonData.map((data) => {
      // console.log(data)
      return {
        ...data,
        email: data.email.toLowerCase(),
        name: `${data.firstName} ${data.middleName} ${data.lastName}`,
        subjects: data.subjects
          .slice(1, -1)
          .split(",")
          .map((subject) => subject.trim()),
        subjectType: data.subjectType
          .slice(1, -1)
          .split(",")
          .map((subjectType) => subjectType.trim()),
        batch: data.batch
          .slice(1, -1)
          .split(",")
          .map((batch) => batch * 1),
      };
    });
    // console.log(jsonData)
    insertMany(jsonData);
  });

//role
//password
// studentId

const insertMany = async (data) => {
  try {
    const students = await Students.create(data);
    console.log("Students Data imported");
    const userData = students.map((student) => {
      //random password generated , add this instead of somaiya in below return
      const randomPassword = "somaiya123";
      console.log({ studentEmail: student.email, randomPassword });
      const [firstName, middleName, lastName] = student.name.split(" ");

      return {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: student.email,
        studentId: student._id,
        role: 0,
        password: randomPassword,
      };
    });

    // const emailPromises = userData.map(async user => {
    //     const mailOptions = {
    //         from: 'developercell.sksc@somaiya.edu',
    //         to: user.email,
    //         subject: 'Account Credentials',
    //         text: `Hello ${user.firstName},\n\nYour Email is: ${user.email}\nYour Password is: ${user.password}`
    //     };

    //     try {
    //         const info = await transporter.sendMail(mailOptions);
    //         console.log(`Email sent to ${user.firstName}: ` + info.response);
    //     } catch (error) {
    //         console.error(`Error sending email for ${user.firstName}: ${error.message}`);
    //         throw error; // Propagate the error
    //     }
    // });

    // await Promise.all(emailPromises);

    await Users.create(userData);
    console.log("Populated students data in users");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// insertMany()
