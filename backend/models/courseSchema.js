const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    courseName : {
        type:String,
        trim:true,
        required:true
    },
    semester : {
        type:String,
        trim:true,
        required:true
    },
    subjects : {
        type:[String],
        required:true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Course', courseSchema);
