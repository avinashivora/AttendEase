const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const teacherSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    visitingFaculty: {
      type: Boolean,
      default: false,
    },
    selectQuery: [
      {
        semester: {
          type: Number,
        },
        subjects: {
          type: String,
          trim: true,
        },
        subjectType: {
          type: String,
          trim: true,
        },
        course: {
          type: String,
          trim: true,
        },
        batch: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", teacherSchema);
