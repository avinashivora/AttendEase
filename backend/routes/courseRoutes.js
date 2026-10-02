const express = require('express')

const { getCourses,getCourseData, getAllCourses, updateCourse } = require('../controllers/courseControllers')

const router = express.Router()

router.get('/get-courses',getCourses)
router.get("/get-course-data",getCourseData)
router.get('/get-all-courses', getAllCourses)
router.put('/update-course/:courseId', updateCourse)

module.exports=router