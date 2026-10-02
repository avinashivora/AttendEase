const express = require("express");

const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacherByTeacher,
} = require("../controllers/teacherControllers");

const router = express.Router();

router.get("/get-teachers", getAllTeachers);
router.get("/get-single-teacher", getSingleTeacher);
router.put("/update-teacher-by-teacher/:teacherId", updateTeacherByTeacher);

module.exports = router;