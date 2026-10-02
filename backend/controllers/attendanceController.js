const moment = require("moment-timezone")
const mongoose = require("mongoose")
const Students = require("./../models/studentsSchema")
const Attendance = require("./../models/attendanceSchema")
const Teacher = require("./../models/teachers")



exports.getStudentAttendance = async (req,res) => {
    try {
        // Extract email from the request body
        const { email } = req.body;

        // Validate the email
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Fetch all attendance records for the student with the specified email
        const attendanceRecords = await Attendance.find({
            'attendanceRecords.email': email // Match the email in attendance records
        });

        // If no records found
        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found for the specified student." });
        }

        // Prepare the response
        const response = attendanceRecords.map(record => {
            const date = moment(record.createdAt).format('YYYY-MM-DD'); // Extract the date
            const studentAttendance = record.attendanceRecords
                .filter(student => student.email === email) // Filter for the specific student
                .map(student => ({
                    seatNumber: student.seatNumber,
                    name: student.name,
                    present: student.present // true or false
                }));

            return {
                date: date,
                subject: record.subject,
                batch: record.batch,
                course: record.course,
                attendance: studentAttendance
            };
        });

        // Send the response
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(500).json({ message: "An error occurred while fetching attendance." });
    }
};



//needs an update
exports.getStudents = async (req, res) => {
    if (req.query.subjects) {
        req.query.subjects = { $in: [req.query.subjects] }
    }

    Students.find(req.query).then(response => {
        res.json({
            message: "success",
            data: response
        })

    }).catch(err => {
        res.status(500).json({
            message: "fail",
            data: err
        })
    })
}

exports.markAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.findById(req.body.attendanceId)
        if (attendance.accepting) {

            const conditions = {
                ...{ _id: req.body.attendanceId },
                'attendanceRecords.seatNumber': req.body.seatNumber,
            };

            const update = {
                $set: {
                    'attendanceRecords.$.present': true,
                    'attendanceRecords.$.markedAt': new Date()
                },
            };

            const result = await Attendance.findOneAndUpdate(conditions, update, { new: true });
            res.json({
                // message : `Attendance marked for ${record.name} ${record.seatNo}`,
                success: true,
                result
            })
        } else {
            res.json({
                success: false,
                message: "Portal closed"
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}


exports.openAttendancePortal = async (req, res, next) => {
    try {
        const teacherAnotherActivePortal = await Attendance.findOne({ teacherId: req.body.teacherId, accepting: true })
        if (teacherAnotherActivePortal) {
            return res.json({
                success: false,
                message: `Teacher still has an active portal in ${teacherAnotherActivePortal.course}
                 ${teacherAnotherActivePortal.semester} ${teacherAnotherActivePortal.subject} ${teacherAnotherActivePortal.batch} `
            })
        }
        const { course, semester, batch, startTime, endTime, subjectType } = req.body
        const currentDate = new Date()
        const badTeacher = await Attendance.findOne({
            $or: [
                { $or: [{ startTime: startTime }, { endTime: endTime }] },
                {
                    $and: [
                        { startTime: { $lt: req.body.startTime } },
                        { endTime: { $gt: req.body.startTime } }
                    ]
                },
                {
                    $and: [
                        { startTime: { $lt: req.body.endTime } },
                        { endTime: { $gt: req.body.endTime } }
                    ]
                }
            ],
            course,
            semester,
            batch,
            // subjectType,
            createdAt: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0),
                $lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59)
            }
        });

        if (badTeacher) {

            return res.json({
                success: false,
                message: `Another lecture was going on in the class at this time of ${badTeacher.subject}`
            })
        }

        const teacher = await Teacher.findById(req.body.teacherId)
        let selectQuery;
        teacher.selectQuery.map(el => {
            if (el.course === req.body.course && el.semester === req.body.semester
                && el.subjects === req.body.subjects && el.batch === req.body.batch && el.subjectType === req.body.subjectType) {
                selectQuery = el
            }
        })


        const filter = {
            course: selectQuery.course,
            semester: selectQuery.semester,
            subjects: { $in: [req.body.subjects] },
            subjectType: { $in: [req.body.subjectType] },
            batch: { $in: [req.body.batch] }
        }

        const students = await Students.find(filter)

        let studentsToAddInAttendanceRecord = []
        const studentRecords = students.map(student => {
            for (let i = 0; i < student.subjects.length; i++) {
                if (student.batch[i] === req.body.batch
                    && student.subjectType[i] === req.body.subjectType
                    && student.subjects[i] === req.body.subjects) {
                    studentsToAddInAttendanceRecord.push({
                        seatNumber: student.seatNumber,
                        name: student.name,
                        email: student.email
                    })
                }
            }

        })
        const attendance = await Attendance.create({
            teacherId: req.body.teacherId,
            accepting: true,
            course: selectQuery.course,
            semester: selectQuery.semester,
            subject: selectQuery.subjects,
            subjectType: selectQuery.subjectType,
            batch: selectQuery.batch,
            portalLocation: req.body.portalLocation,
            noOfLectures: req.body.noOfLectures,
            attendanceRecords: studentsToAddInAttendanceRecord,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })

        res.status(200).json({
            success: true,
            message: `Attendance portal opened Course : ${attendance.course} Sem :  ${attendance.semester} Subject : ${attendance.subject} Batch :  ${attendance.batch}`,
            attendanceId: attendance._id
        })


        setTimeout(async () => {
            const closeAttendance = await Attendance.findByIdAndUpdate(attendance._id,
                { $set: { accepting: false } },
                { new: true }
            )
        }, (req.body.portalTime * 1) * 60 * 1000)


    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }

}

exports.getActivePortalForStudents = async (req, res) => {
    try {
        const filter = {
            course: req.query.course,
            semester: req.query.semester * 1,
            subject: req.query.subject,
            subjectType: req.query.subjectType,
            batch: req.query.batch * 1,
            accepting: true
        }

        const attendance = await Attendance.findOne(filter, { attendanceRecords: 0, teacherId: 0 })
        if (!attendance) {
            res.status(200).json({
                success: false,
                message: "NO active portal for the class"
            })
        } else {
            res.status(200).json({
                success: true,
                attendance
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }


}

exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.attendanceId)
        attendance.attendanceRecords.sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber))
        res.status(200).json({
            success: true,
            attendance
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.getActivePortalsForTeachers = async (req, res) => {
    try {
        const activePortals = await Attendance.find({ teacherId: req.params.teacherId }, { attendanceRecords: 0 })
        res.status(200).json({
            success: true,
            activePortals
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.getAllActivePortals = async (req, res) => {
    try {
        const activePortals = await Attendance.find({}, { attendanceRecords: 0 })
        res.status(200).json({
            success: true,
            activePortals
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.getFilteredPortal = async (req, res) => {
    try {
        const { course, semester, startDate, endDate } = req.query

        const portal = await Attendance.find({
            course: course,
            semester: semester,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        return res.status(200).json({
            success: true,
            portal,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    }
};


exports.getFilteredPortalForTeachers = async (req, res) => {
    try {

        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5.5 hours ahead of UTC)

        const startDate = new Date(req.query.startDate)
        const endDate = new Date(req.query.endDate)

        const parseISTDate = (istDateString) => {
            const date = new Date(istDateString);
            return new Date(date.getTime() - istOffset);
        };

        const query = {
            teacherId: req.params.teacherId,
            course: req.query.course,
            semester: req.query.semester,
            createdAt: { $gte: parseISTDate(startDate), $lte: parseISTDate(endDate) }
        }
        const portal = await Attendance.find(query)
        res.status(200).json({
            success: true,
            portal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.markAttendanceByTeacher = async (req, res) => {
    try {
        const conditions = {
            _id: req.body.attendanceId,
            'attendanceRecords.seatNumber': req.body.seatNumber,
        };
        const update = {
            $set: {
                'attendanceRecords.$.present': req.body.present,
                'attendanceRecords.$.markedAt': new Date()
            },
        };
        const updatedAttendance = await Attendance.findOneAndUpdate(conditions, update, { new: true })

        res.status(200).json({
            success: true,
            message: `${req.body.seatNumber} marked ${req.body.present}`,
            updatedAttendance
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.deletePortal = async (req, res) => {
    try {
        const deletedPortal = await Attendance.findByIdAndDelete(req.params.attendanceId)
        res.json({
            success: true,
            message: "Portal deleted",
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}

exports.closePortal = async (req, res) => {
    try {
        const closeAttendance = await Attendance.findByIdAndUpdate(req.params.attendanceId,
            { $set: { accepting: false } },
            { new: true }
        )
        if (closeAttendance) {
            res.json({
                success: true,
                message: `Attendance portal closed for ${closeAttendance.course} ${closeAttendance.semester} 
                ${closeAttendance.subject} ${closeAttendance.batch}`
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
}
