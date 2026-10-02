const mongoose = require("mongoose")
// const {ObjectId} = mongoose.Schema
const studentsSchema = new mongoose.Schema({
    // userId:{
    //     type:ObjectId,
    //     ref:"User"
    // },
    name : {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    semester : {
        type: Number,
        required: true
    },
    subjects : {
        type: [String],
        required: true
    },
    subjectType : {
        type: [String],
        required: true
    },
    batch : {
        type: [Number],
        required: true
    },
    course : {
        type: String,
        trim: true,
        required: true
    },
    seatNumber : {
        type: String,
        required: true,
        unique: true
    }
})

const studentsModel = mongoose.model("Students",studentsSchema)
module.exports = studentsModel