const mongoose = require("mongoose")

const issueSchema = new mongoose.Schema({
    subject : {
        type : String,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        trim : true
    }
})

const Issues = mongoose.model("Issue",issueSchema)

module.exports = Issues