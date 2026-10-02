const express = require("express");
const router = express.Router();

const { createStudent, getAllMinors, getOneMinor, getOneMinorByID, getAllStudentsByMinor, getAllMinorByProgram, getAllPrograms, getAllLanguages,
    getAllProfessionalCourses, getAllStudentsByCategories, minorData, getStudentByEmail, updateStudentByEmail,
    deleteStudentByEmail, updateStudentMemberIdByEmail, downloadDatabaseBackup
} = require("../controllers/minorControllers");


const verifyAdmin = require("../middleware/adminAuthMiddleware")

router.get("/getAllPrograms", getAllPrograms)
router.get("/getMinor", getAllMinors);
router.get("/getOneMinorByID/:_id", getOneMinorByID)
router.get("/getOneMinor/:courseName", getOneMinor);
router.patch("/createStudent", createStudent);
router.get("/getAllMinorByProgram/:progName", getAllMinorByProgram);
router.get("/getStudent/:minorName", getAllStudentsByMinor);
router.get("/getAllLanguages", getAllLanguages);
router.get("/getAllProfessionalCourses", getAllProfessionalCourses);
router.get("/getAllStudentsByCategories", getAllStudentsByCategories)
router.post("/minorData",verifyAdmin ,minorData)
router.get("/getStudentByEmail/:email", getStudentByEmail);
router.patch('/updateStudentByEmail', updateStudentByEmail);
router.patch('/updateStudentMemberIdByEmail', updateStudentMemberIdByEmail);
router.delete('/deleteStudentByEmail/:email', deleteStudentByEmail);
router.post('/downloadDatabaseBackup', verifyAdmin, downloadDatabaseBackup);


module.exports = router;