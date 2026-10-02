const mongoose = require("mongoose");

const languagesSchema = new mongoose.Schema({
  langCourseList: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Languages", languagesSchema);