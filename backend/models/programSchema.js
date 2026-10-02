const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  progName: {
    type: String,
    required: true,
  },
  minor: [],
});

module.exports = mongoose.model("Program", programSchema);