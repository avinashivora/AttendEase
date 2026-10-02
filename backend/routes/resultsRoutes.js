const express = require('express')
const router = express.Router()

const { createResult, getAllResults, fetchEmail } = require('../controllers/resultsControllers')

router.post('/post-results', createResult)
router.post('/verify-email', fetchEmail)
router.get('/get-all-results', getAllResults)

module.exports = router