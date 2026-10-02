const mongoose = require('mongoose')

const rankSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    contactNo: {
        type: String,
    },
    course: {
        type: String
    },
    year: {
        type: String
    },
    rollNo: {
        type: String
    },
    appearedResults: [{
        correctAnswer: {
            type: String
        },
        isCorrect: {
            type: Boolean
        },
        options: [],
        type: {
            type: String
        },
        isCode:{
            type: Boolean
        },
        codeContent: {
            type: String
        },
        question: {
            type: String
        },
        selectedAnswer: {
            type: String
        }
    }],
    score: {
        type: Number
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Result', rankSchema)