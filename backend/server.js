const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
// import { writeFileSync } from 'fs';
// const cron = require('node-cron');

const app = express()
mongoose.set('strictQuery', false)

const authRouter = require("./routes/authRoutes")
const adminRouter = require("./routes/adminRoutes")
const attendanceRouter = require("./routes/attendanceRoutes")
const teacherRouter = require('./routes/teacherRoutes')
const courseRouter = require('./routes/courseRoutes')
const issueRouter = require("./routes/issueRoutes")
const resultsRouter = require("./routes/resultsRoutes")
const minorRoutes = require("./routes/minorRoutes")
const patchRoutes = require("./routes/patchRoutes")

mongoose.connect(process.env.DATABASE_LOCAL).then(() => console.log('DB connected'))
    .catch(err => {
        console.log("DB CONNECTION ERROR", err)
    })

app.use(morgan('dev'))

app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.LOCAL_URL}` }))
}
app.use(cors())

app.use('/api_v1', authRouter)
app.use('/api_v1', adminRouter)
app.use('/api_v1', attendanceRouter)
app.use('/api_v1', teacherRouter)
app.use('/api_v1', courseRouter)
app.use('/api_v1', issueRouter)
app.use('/api_v1', resultsRouter)
app.use('/api_v1', minorRoutes)
app.use('/api_v1', patchRoutes)

// run `npm install node-cron` before running above code
// const resetMailCount = () => {
//     writeFileSync('./emailCount.txt', "0", 'utf8', (err) => {
//         if (err) {
//             console.log("Error reseting count:", err);
//         } else {
//             console.log("Mail count reset");
//         }
//     });
// }

// Schedule the task to run daily at midnight
// cron.schedule('0 0 * * *', resetMailCount);

const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`Server on port: ${port} started`)
})
