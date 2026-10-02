
const mongoose = require("mongoose")
const Course = require("./../models/courseSchema")
const { response } = require("express")


exports.getCourses = (req,res) =>{

    Course.distinct("courseName").then(response =>{
        res.json({
            message:"success",
            data:response
        })
        
    }).catch(err =>{
        console.log(err)
        res.json({
            message:"fail",
            data:err
        })
    })
}



exports.getCourseData = async(req,res) => {
    try{
        console.log(req.query)
        const courseData = await Course.find({courseName : req.query.course})
        res.status(200).json({
            success: true,
            courseData
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message:"fail",
            data:err
        })
    }
}

exports.getAllCourses = (req, res) => {
    Course.find().then(courses => {
        res.status(200).json({
            success: true,
            courses
        })
    }).catch(err => {
        res.status(400).json({
            success: false,
            err
        })
    })
}

exports.updateCourse = (req, res) => {
    // console.log(req.body)
    Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true }).then(response => {
        res.send({
            success: true,
            response: response
        })
    }).catch(err => {
        res.send({
            success: false,
            error: err
        })
    })
}