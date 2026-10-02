const PatchNotes = require("../models/patchNotes")

exports.addPatchNote = async(req, res) => {
    try{
        //console.log(req.body);
        const response = await PatchNotes.create(req.body)
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

exports.getLatestPatchNote = async(req, res) => {
    try {
        const latestPatchNote = await PatchNotes.find({}).sort({releaseDate:-1}).limit(1);
        return res.json({
            success: true,
            data: latestPatchNote
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

exports.updatePatchNote = async(req, res) => {
    try {
        const response = await PatchNotes.findOneAndUpdate({version:req.query.version}, req.body, {new: true})
        return res.json({
            success: true,
            data: response
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

exports.deletePatchNote = async(req, res) => {
    try {
        const response = await PatchNotes.findOneAndDelete({version:req.query.version})
        return res.status(500).json({
            success: true,
            data: response
        })
    } catch(err) {
        return res.json({
            success: false,
            error: err
        })
    }
}