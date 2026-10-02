const express = require("express")
const {getStudents,openAttendancePortal,markAttendance,
    getActivePortalsForTeachers,closePortal,deletePortal,markAttendanceByTeacher,getAttendanceById, getActivePortalForStudents, getFilteredPortalForTeachers,
    getFilteredPortal, getAllActivePortals,getStudentAttendance} = require("./../controllers/attendanceController")
const router = express.Router()

router.post('/get-student-attendance',getStudentAttendance)
router.get("/getstudents",getStudents)
router.get('/get-active-portal-students', getActivePortalForStudents)
router.get('/get-active-portal-teachers/:teacherId', getActivePortalsForTeachers)
router.get('/get-filtered-portal-teachers/:teacherId', getFilteredPortalForTeachers)
router.get('/get-filtered-portal', getFilteredPortal)
router.get('/get-all-active-portals', getAllActivePortals)
router.post("/open-attendance-portal", openAttendancePortal)
router.patch("/mark-attendance", markAttendance)
router.get("/get-attendance/:attendanceId", getAttendanceById)
router.patch("/mark-attendance-teacher", markAttendanceByTeacher)
router.delete("/delete-portal/:attendanceId", deletePortal)
router.patch("/close-portal/:attendanceId", closePortal)
module.exports = router
