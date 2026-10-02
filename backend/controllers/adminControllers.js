//crud for teachers
const teachers = require("../models/teachers");
const Users = require("../models/user");
const Attendance = require("../models/attendanceSchema");
const Course = require("../models/courseSchema");
const { parseISTDate } = require("./../utils/utils");

exports.createTeacher = (req, res) => {
  let teacher = new teachers(req.body);
  console.log(req.body);
  teacher
    .save()
    .then((response) => {
      return res.json({
        message: response,
        success: true,
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
        success: false,
      });
    });
};

exports.getAllTeachers = (req, res) => {
  Users.find({ role: 1 })
    .populate("teacherId")
    .then((response) => {
      // console.log(response)
      res.send({
        response,
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        error: err,
      });
    });
};

exports.updateTeacher = (req, res) => {
  console.log(req.body);
  Users.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    .then((success) => {
      teachers
        .findByIdAndUpdate(success.teacherId, req.body, { new: true })
        .then((response) => {
          res.send({
            success: true,
            response: response,
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            error: err,
          });
        });
    })
    .catch((err) => {
      res.send({
        success: false,
        error: err,
      });
    });
};

exports.deleteTeacher = (req, res) => {
  teachers
    .findByIdAndUpdate(
      req.params.userId,
      { $set: { isActive: false } },
      { new: true }
    )
    .then((response) => {
      res.send({
        response: response,
        success: true,
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        error: err,
      });
    });
};

exports.getDefaultersByCourseAndSem = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const query = {
      course: req.query.course,
      semester: req.query.semester,
      createdAt: { $gte: parseISTDate(startDate), $lte: parseISTDate(endDate) },
    };

    // console.log(startDate,endDate)
    // console.log(parseISTDate(startDate),parseISTDate(endDate))
    const attendances = await Attendance.find(query);
    if (attendances.length > 0) {
      let students = {};
      attendances.map((attendance) => {
        attendance.attendanceRecords.map((record) => {
          // console.log(record)
          if (!students[record.seatNumber]) {
            students[record.seatNumber] = {
              seatNumber: record.seatNumber,
              name: record.name,
              email: record.email,
              totalLectures: 0,
              lecturesPresent: 0,
            };
          }
          if (record.present) {
            students[record.seatNumber].lecturesPresent += 1;
          }
          students[record.seatNumber].totalLectures += 1;
        });
      });

      res.json({
        success: true,
        students: Object.values(students),
      });
      // const objectLength = Object.keys(students).length;
      // console.log('Object Length:', objectLength);
    } else {
      res.status(400).json({ message: "No Data Found", success: false });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};

exports.createCourse = (req, res) => {
  let course = new Course(req.body);
  console.log(req.body);
  course
    .save()
    .then((response) => {
      return res.json({
        message: response,
        success: true,
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
        success: false,
      });
    });
};

exports.changeTeacherPermission = (req, res) => {
  const teacherId = req.params.teacherId;

  teachers
    .findById(teacherId)
    .then((teacher) => {
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      // Toggle the isActive field
      teacher.isActive = !teacher.isActive;

      // Save the updated teacher
      return teacher.save();
    })
    .then((updatedTeacher) => {
      res.json({
        message: "Teacher status updated successfully",
        isActive: updatedTeacher.isActive,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getDefaultersByCourseAndSemAndSubject = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    let query = {
      course: req.query.course,
      semester: req.query.semester * 1,
      subject: req.query.subject,
      createdAt: { $gte: parseISTDate(startDate), $lte: parseISTDate(endDate) },
    };
    if (req.query.subjectType && req.query.subjectType !== "both") {
      query = { ...query, subjectType: req.query.subjectType };
    }
    const attendances = await Attendance.find(query);

    if (attendances.length > 0) {
      let students = {};
      attendances.map((attendance) => {
        attendance.attendanceRecords.map((record) => {
          // console.log(record)
          if (!students[record.seatNumber]) {
            students[record.seatNumber] = {
              seatNumber: record.seatNumber,
              name: record.name,
              email: record.email,
              lecturesPresent: 0,
              totalLectures: 0,
            };
          }
          if (record.present) {
            students[record.seatNumber].lecturesPresent += 1;
          }
          students[record.seatNumber].totalLectures += 1;
        });
      });

      res.json({
        success: true,
        students: Object.values(students),
      });
      // const objectLength = Object.keys(students).length;
      // console.log('Object Length:', objectLength);
    } else {
      res.status(400).json({ message: "No Data Found", success: false });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};

exports.cummulativeAttendance = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    let query = {
      course: req.query.course,
      semester: req.query.semester * 1,
      createdAt: { $gte: parseISTDate(startDate), $lte: parseISTDate(endDate) },
    };

    const attendances = await Attendance.find(query);
    if (attendances.length > 0) {
      let students = {};
      attendances.map((attendance) => {
        attendance.attendanceRecords.map((record) => {
          if (!students[record.seatNumber]) {
            students[record.seatNumber] = {
              seatNumber: record.seatNumber,
              name: record.name,
              email: record.email,
              lecturesPresent: 0,
              totalLectures: 0,
            };
          }

          if (
            !students[record.seatNumber][
            attendance.subject +
            " " +
            attendance.subjectType +
            " lecturesPresent"
            ] &&
            !students[record.seatNumber][
            attendance.subject +
            " " +
            attendance.subjectType +
            " totalLectures"
            ]
          ) {
            students[record.seatNumber] = {
              ...students[record.seatNumber],
              [attendance.subject +
                " " +
                attendance.subjectType +
                " lecturesPresent"]: 0,
              [attendance.subject +
                " " +
                attendance.subjectType +
                " totalLectures"]: 0,
            };
          }

          if (record.present) {
            students[record.seatNumber].lecturesPresent += 1;
            students[record.seatNumber][
              attendance.subject +
              " " +
              attendance.subjectType +
              " lecturesPresent"
            ] += 1;
          }
          students[record.seatNumber].totalLectures += 1;
          students[record.seatNumber][
            attendance.subject + " " + attendance.subjectType + " totalLectures"
          ] += 1;
        });
      });

      res.json({
        success: true,
        studentsLength: Object.keys(students).length,
        students: Object.values(students),
      });
      // const objectLength = Object.keys(students).length;
      // console.log('Object Length:', objectLength);
    } else {
      res.status(400).json({ message: "No Data Found", success: false });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};

exports.getActivePortals = async (req, res) => {
  try {
    const activeAttendances = await Attendance.find(
      { accepting: true },
      { attendanceRecords: 0 }
    );
    res.json({
      success: true,
      activeAttendances,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};

exports.getAttendancesByDate = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const istDate = parseISTDate(date);
    const startTimeOfTheDay = new Date(istDate);
    startTimeOfTheDay.setUTCHours(0, 0, 1);

    const attendances = await Attendance.find({
      createdAt: { $gte: istDate, $lte: istDate },
    });
    console.log(date);
    console.log(istDate);
    console.log(startTimeOfTheDay);
    res.json({
      success: true,
      attendances,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};
