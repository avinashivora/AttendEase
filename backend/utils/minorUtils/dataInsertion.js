// const mongoose = require("mongoose");
// const Minor = require("../models/MinorSchema");
// const ProgramSchema = require('../models/ProgramSchema');
// const LanguagesSchema = require("../models/LanguagesSchema");
// const ProfessionalCourse = require("../models/ProfessionalCourse")
// const minordata = require("../dummydata/minordata.json");
// const programdata = require("../dummydata/programdata.json");
// const langdata = require("../dummydata/language.json");
// const profCourseData = require("../dummydata/professionalcourses.json")


// require("dotenv").config({
//   path: "../.env",
// });

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((err) => {
//     console.log("Database Connection Error: ", err);
//   });

// // Insert the dummy data into the database
// const insertMany = async () => {
//   try {
//     await Minor.create(minordata);
//     console.log("Data imported");
//     console.log("Minor Data Updated");
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };
// insertMany();

// const progrmdt = async () => {
//   try {
//     await ProgramSchema.create(programdata);
//     console.log("Data imported");
//     console.log("Program Data Updated");
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };
// progrmdt();

// const insertLanguages = async () => {
//   try {
//     await LanguagesSchema.insertMany(langdata);
//     console.log("Language Data imported successfully");
//   } catch (err) {
//     console.error("Error importing Language Data:", err);
//   } 
// };
// insertLanguages();

// const insertProfessionalCourses = async () => {
//   try {
//     await ProfessionalCourse.insertMany(profCourseData);
//     console.log("Professional Courses Data imported successfully");
//   } catch (err) {
//     console.error("Error importing Professional Courses Data:", err);
//   }
// };
// insertProfessionalCourses();


const mongoose = require("mongoose");
const Minor = require("../../models/minorSchema");
const ProgramSchema = require('../../models/programSchema');
const LanguagesSchema = require("../../models/languagesSchema");
const ProfessionalCourse = require("../../models/professionalCourseSchema")
const minordata = require("../../productionData/MinorData/minorData.json");
const programdata = require("../../productionData/MinorData/programdata.json");
const langdata = require("../../productionData/MinorData/language.json");
const profCourseData = require("../../productionData/MinorData/professionalcourses.json")


require("dotenv").config({
    path: "../../.env",
  });

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Database Connection Error: ", err);
  });

// Insert the dummy data into the database
const insertMany = async () => {
  try {
    await Minor.create(minordata);
    console.log("Data imported");
    console.log("Minor Data Updated");
  } catch (err) {
    console.log(err);
  }
};
insertMany();

const progrmdt = async () => {
  try {
    await ProgramSchema.create(programdata);
    console.log("Data imported");
    console.log("Program Data Updated");
  } catch (err) {
    console.log(err);
  }
};
progrmdt();

const insertLanguages = async () => {
  try {
    await LanguagesSchema.insertMany(langdata);
    console.log("Language Data imported successfully");
  } catch (err) {
    console.error("Error importing Language Data:", err);
  } 
};
insertLanguages();

const insertProfessionalCourses = async () => {
  try {
    await ProfessionalCourse.insertMany(profCourseData);
    console.log("Professional Courses Data imported successfully");
  } catch (err) {
    console.error("Error importing Professional Courses Data:", err);
  }
  process.exit();
};
insertProfessionalCourses();