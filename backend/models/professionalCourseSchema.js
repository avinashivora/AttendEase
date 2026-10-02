const mongoose = require("mongoose");

const professionalCourse = new mongoose.Schema({
  profCourse: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Professional_Courses", professionalCourse);
