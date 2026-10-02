const mongoose = require("mongoose");
const fs = require("fs");
const Course = require("../models/courseSchema");

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

const jsonFilePath = "../productionData/finalOddSemData/programData.json";

const courses = JSON.parse(fs.readFileSync(jsonFilePath));

const insertMany = async () => {
  try {
    await Course.create(courses);
    console.log("Data imported");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
insertMany();
