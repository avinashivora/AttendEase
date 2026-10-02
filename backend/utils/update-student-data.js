const csv = require("csvtojson");
const mongoose = require("mongoose");
const Students = require("../models/studentsSchema");
const Users = require("../models/user");
const { appendFileSync } = require("fs");

const skipped = {
  log: (...args) => {
    return appendFileSync("./StudentsUpdateSkipped.csv", args.join(",") + "\n");
  },
};

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
const csvFilePath = "../productionData/finalOddSemData/yehLe.csv";

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    let jsonData = jsonObj;
    // console.log(jsonData)
    jsonData = jsonData.map((data) => {
      // console.log(data)
      return {
        ...data,
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
    updateMany(jsonData, {
      // only either of email or seat no. should be changed
      name: false,
      email: false,
      semester: false,
      subjects: true,
      subjectType: true,
      batch: true,
      course: false,
      seatNumber: false,
    });
  });

const updateMany = async (data, toChange) => {
  try {
    const updatedStudents = []; // Array to store updated students
    for (const studentData of data) {
      let existingStudent = await Students.findOne({
        email: studentData.email,
      });
      if (!existingStudent) {
        //console.log(`Student doesn't exist : ${studentData.email}`);
        existingStudent = await Students.findOne({
          seatNumber: studentData.seatNumber,
        });
      }
      if (!existingStudent) {
        //console.log(`Student doesn't exist : ${studentData.seatNumber}`);
        const [firstName, middleName, lastName] = studentData.name.split(" ");
        skipped.log(
          studentData.email,
          firstName,
          middleName,
          lastName,
          studentData.semester,
          '"[' + studentData.subjects.join(",") + ']"',
          '"[' + studentData.subjectType.join(",") + ']"',
          studentData.course,
          studentData.seatNumber,
          '"[' + studentData.batch.join(",") + ']"'
        );
      } else {
        // Creates new student object with fields set to true in toChange
        const filteredStudentData = Object.keys(toChange).reduce(
          (acc, field) => {
            if (toChange[field] && studentData.hasOwnProperty(field)) {
              acc[field] = studentData[field];
            }
            return acc;
          },
          {}
        );
        // console.log(filteredStudentData)
        const updatedStudent = await Students.findOneAndUpdate(
          { email: existingStudent.email },
          filteredStudentData,
          { new: true }
        );
        updatedStudents.push(updatedStudent);
        toChange.email
          ? await Users.findOneAndUpdate(
              { email: existingStudent.email },
              { email: filteredStudentData.email },
              { new: true }
            )
          : null;
      }
    }
    console.log("Updated students!");
    // console.log("Updated students:", updatedStudents);

    // Use when updating name
    if (toChange.name === true) {
      const userData = updatedStudents.map((student) => {
        const [firstName, middleName, lastName] = student.name.split(" ");
        return {
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          email: student.email,
        };
      });
      i = 0;
      while (i < userData.length) {
        const user = await Users.findOneAndUpdate(
          { email: userData[i].email },
          {
            firstName: userData[i].firstName,
            middleName: userData[i].middleName,
            lastName: userData[i].lastName,
          },
          { new: true }
        );
        i++;
      }
      console.log("Updated students data in users");
    }
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
