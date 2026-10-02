const students = require("../models/studentsSchema")
const Teacher = require("./../models/teachers")

exports.getSingleTeacher = (req, res) => {

    Teacher.findOne(req.query).then(data => {
        res.status(200).json({
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(500).json({
            status: false,
            error: err
        })
    })
}

exports.getAllTeachers = (req, res) => {

    Teacher.find().then(data => {
        res.status(200).json({
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(500).json({
            status: false,
            error: err
        })
    })
}

exports.updateTeacherByTeacher = (req, res) => {
    console.log("gyvuhijokp", req.body)
    Teacher.findByIdAndUpdate(req.params.teacherId, req.body, { new: true }).then(response => {
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