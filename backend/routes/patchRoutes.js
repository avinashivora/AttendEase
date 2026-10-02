const express = require('express')
const { addPatchNote, getLatestPatchNote, updatePatchNote, deletePatchNote } = require("../controllers/patchControllers")

const router = express.Router()

router.post("/add-patch", addPatchNote)
router.get("/get-latest-patch", getLatestPatchNote)
router.patch("/update-patch", updatePatchNote)
router.delete("/delete-patch", deletePatchNote)

module.exports = router;