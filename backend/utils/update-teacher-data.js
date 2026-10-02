// const csv = require("csvtojson");
const mongoose = require("mongoose");
const Teachers = require("../models/teachers");
const Users = require("../models/user");
const fs = require("fs");

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

const jsonFilePath = "../productionData/finalOddSemData/facultyData.json";
const teacherData = JSON.parse(fs.readFileSync(jsonFilePath));

const mapJsonToSchema = (jsonData) => {
  return jsonData.map((item) => {
    return {
      email: item.email,
      // Uncomment whichever needs to be updated
      // name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      // isActive: item.isActive,
      // visitingFaculty: item.visitingFaculty,
      selectQuery: item.selectQuery.map((selectQuery, index) => {
        return {
          semester: selectQuery.semester,
          subjects: selectQuery.subjects,
          course: selectQuery.course,
          batch: selectQuery.batch,
          subjectType: selectQuery.subjectType,
        };
      }),
    };
  });
};

// Usage
const mappedTeachersData = mapJsonToSchema(teacherData);

const udpateMany = async () => {
  // Use when updating email
    // i = 0
    // existingEmails = []
    // newEmails = []
    // if (existingEmails.length === newEmails.length){
    // 	while (i < existingEmails.length) {
    // 		const teacher = await Teachers.findOneAndUpdate({email: existingEmails[i]}, {email: newEmails[i]}, {new:true})
    // 		console.log(teacher)
    // 		const user = await Users.findOneAndUpdate({email: existingEmails[i]}, {email: newEmails[i]}, {new:true})
    // 		console.log(user)
    // 		i++
    // 	}
    // } else {
    // 	console.log("Email arrays length dont match")
    // }
    // console.log("Teacher Data updated in User");

  try {
    const updatedTeachers = []; // Array to store updated teachers

    for (const teacherData of mappedTeachersData) {
      const existingTeacher = await Teachers.findOne({
        email: teacherData.email,
      });
      if (!existingTeacher) {
        console.log(`Teacher doesn't exist : ${teacherData.email}`);
      } else {
        const updatedTeacher = await Teachers.findOneAndUpdate(
          { email: teacherData.email },
          teacherData,
          { new: true }
        );
        updatedTeachers.push(updatedTeacher);
      }
    }
    console.log("Updated teachers!")
    // console.log("Updated teachers:", updatedTeachers);

    // Use when updating name
    // const userData = updatedTeachers.map((teacher) => {
    // 	const [sal, firstName, middleName, lastName] = teacher.name.split(" ");
    // 	console.log(teacher.name)
    // 	console.log(sal, firstName, middleName, lastName)
    // 	return {
    // 		firstName: `${sal} ${firstName}`,
    // 		middleName: middleName,
    // 		lastName: lastName,
    // 		email: teacher.email,
    // 	}
    // })
    // i = 0
    // while (i < userData.length) {
    // 	const user = await Users.findOneAndUpdate({email: userData[i].email},
    // 		{
    // 			firstName: userData[i].firstName,
    // 			middleName: userData[i].middleName,
    // 			lastName: userData[i].lastName,
    // 		},
    // 		{new:true})
    // 	i++
    // }
  } catch (err) {
    console.log("Error: ", err);
  }
  process.exit();
};

udpateMany();
