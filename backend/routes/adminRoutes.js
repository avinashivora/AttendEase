const express = require("express");
const {
  createTeacher,
  getAllTeachers,
  deleteTeacher,
  updateTeacher,
  getDefaultersByCourseAndSem,
  createCourse,
  changeTeacherPermission,
  getDefaultersByCourseAndSemAndSubject,
  cummulativeAttendance,
  getActivePortals,
  getAttendancesByDate,
} = require("../controllers/adminControllers");
// const verifyAdmin = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/get-all-teachers", getAllTeachers);
router.delete("/delete-teacher/:userId", deleteTeacher);
router.put("/update-teacher/:userId", updateTeacher);
router.get("/get-defaulter-by-course-sem", getDefaultersByCourseAndSem);
router.get("/get-defaulter-by-course-sem-sub", getDefaultersByCourseAndSemAndSubject);
router.post("/create-course", createCourse);
router.patch("/change-teacher-permission/:teacherId", changeTeacherPermission);
router.get("/get-cummulative-attendance", cummulativeAttendance);
router.get("/get-active-portals-admin", getActivePortals);
router.get("/get-attendances-by-date", getAttendancesByDate);
module.exports = router;
