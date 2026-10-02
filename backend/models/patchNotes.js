const mongoose = require('mongoose');

const patchNoteSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    newFeatures: {
        type: [String],
        default: []
    },
    improvements: {
        type: [String],
        default: []
    },
    bugFixes: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("PatchNotes",patchNoteSchema)