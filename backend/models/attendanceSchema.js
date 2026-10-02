
const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema


const singleStudentSchema = new mongoose.Schema({
    present: {
        type: Boolean,
        default: false
    },
    seatNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email : {
        type : String,
        required :true
    },
    markedAt: {
        type: Date
    }
});

const attendanceSchema = new mongoose.Schema({
    teacherId: {
        type: ObjectId,
        // ref : "Teacher"
    },
    portalLocation: {
        latitude: String,
        longitude: String
    }, 
    attendanceRecords: {
        type: [singleStudentSchema],
        default: []
    },
    accepting: {
        type: Boolean,
        default : true
    },
    semester: {
        type: Number,
        trim: true,
    },
    subject: {
        type: String,
        required : true,
        trim : true
    },
    subjectType : {
        type : String,
        required : true,
        trim : true 
    },
    course: {
        type: String,
        trim: true,
        required : true
    },
    noOfLectures: {
        type: Number,
    },
    batch: {
        type: Number,
        trim: true,
        required : true
    },
    startTime: {
        type: Number,
        required : true
    },
    endTime: {
        type: Number,
        required : true
    }
}, { timestamps: true })

module.exports = mongoose.model("Attendance", attendanceSchema)