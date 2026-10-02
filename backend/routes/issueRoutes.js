
const express = require("express")
const { createIssue,getIssues } = require("./../controllers/issueController")
const router = express.Router()

router.post("/create-issue",createIssue)
router.get("/get-issues",getIssues)


module.exports = router