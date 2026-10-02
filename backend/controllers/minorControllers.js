const MinorSchema = require("../models/minorSchema");
const ProgramSchema = require("../models/programSchema")
const ProfessionalCourse = require("../models/professionalCourseSchema")
const LanguagesSchema = require("../models/languagesSchema");
const { Parser } = require('json2csv');
const archiver = require('archiver');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os')

exports.minorData = async (req, res) => {
  try {
    // Aggregating the data
    const aggregatedData = await MinorSchema.aggregate([
      { $unwind: "$students" },
      {
        $project: {
          _id: 0,
          minorSubject: "$courseName",
          name: "$students.name",
          email: "$students.email",
          seatno: "$students.seatno",
          mobileno: "$students.mobileno",
          memberid: "$students.memberid",
          programName: "$students.programName",
          professionalcourse: "$students.professionalcourse",
          language: "$students.language"
        }
      }
    ]);

    // Define the fields for the CSV
    const fields = [
      'minorSubject', 'name', 'email', 'seatno',
      'mobileno', 'memberid', 'programName',
      'professionalcourse', 'language'
    ];

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(aggregatedData);

    // Set the headers to indicate a CSV file download
    res.header('Content-Type', 'text/csv');
    res.attachment('studentsdatainCSV.csv');
    return res.send(csv);

  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.downloadDatabaseBackup = async (req, res) => {
  try {
    const dbName = 'attendance-v1';
    const backupDir = path.join(os.tmpdir(), 'backups'); // Use system temp directory
    const backupPath = path.join(backupDir, dbName);

    // Ensure the backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    // Use absolute path for mongodump command
    const mongoDumpCommand = `mongodump --db ${dbName} --out ${backupPath}`;

    // Execute the mongodump command
    exec(mongoDumpCommand, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ message: 'Error creating database backup', error: stderr });
      }

      // Create a ZIP file from the backup directory
      const zipPath = path.join(backupDir, `${dbName}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {

        // Send the ZIP file as a response
        res.download(zipPath, `${dbName}.zip`, (err) => {
          if (err) {
            res.status(500).json({ message: 'Error downloading ZIP file', error: err });
          }

          // Cleanup: remove the backup and ZIP files
          fs.rmdirSync(backupPath, { recursive: true });
          fs.unlinkSync(zipPath);
        });
      });

      archive.on('error', (err) => {
        console.error(`Error during archiving: ${err}`);
        res.status(500).json({ message: 'Error during archiving', error: err });
      });

      // Pipe the archive data to the file
      archive.pipe(output);

      // Append files from the backup directory
      archive.directory(backupPath, false);

      // Finalize the archive (finish the process)
      archive.finalize();
    });
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
    res.status(500).json({ message: 'Server error', error });
  }
};




exports.createStudent = async (req, res) => {
  try {
    const { name, email, seatno, mobileno, memberid, programName, professionalcourse, language, minorSubject } = req.body;

    const existingEmailStudent = await MinorSchema.findOne({ "students.email": email });
    if (existingEmailStudent) {
      return res.status(400).send({ success: false, message: "This email is already used by another student." });
    }

    // Check if the student with the same memberid already exists
    const existingMemberIdStudent = await MinorSchema.findOne({ "students.memberid": memberid });
    if (existingMemberIdStudent) {
      return res.status(400).send({ success: false, message: "This member ID is already used by another student." });
    }

    // Check if the student with the same seatno already exists
    const existingSeatNoStudent = await MinorSchema.findOne({ "students.seatno": seatno });
    if (existingSeatNoStudent) {
      return res.status(400).send({ success: false, message: "This seat number is already used by another student." });
    }

    const minor = await MinorSchema.findOne({ courseName: minorSubject });

    if (!minor) {
      return res.status(404).send({ success: false, message: "Minor subject not found" });
    }

    const student = {
      name,
      email,
      seatno,
      mobileno,
      memberid,
      programName,
      professionalcourse,
      language,
    };
    minor.students.push(student);
    minor.remainingCapacity--;
    await minor.save();
    res.status(201).send({ success: true, message: "Student registered under minor subject" });

  } catch (error) {
    res.status(400).send({ success: true, message: error.message });
  }
};

exports.getAllMinors = async (req, res) => {
  try {
    const minor = await MinorSchema.find()
    res.send({
      success: true,
      data: minor,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getAllMinors = async (req, res) => {
  try {
    const minor = await MinorSchema.find()
    res.send({
      success: true,
      data: minor,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getAllPrograms = async (req, res) => {
  try {
    const Programs = await ProgramSchema.find()
    res.send({
      success: true,
      data: Programs,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getOneMinor = async (req, res) => {
  try {
    const courseName = req.params.courseName;

    const Minor = await MinorSchema.findOne({ courseName: courseName })
    res.status(200).json(Minor)
  } catch (error) {
    console.log(error)
  }
};

exports.getOneMinorByID = (req, res) => {
  MinorSchema.findById(req.params._id).then(response => {
    res.send({
      response
    })
  }).catch(err => {
    res.send({
      success: false,
      error: err
    })
  })
}

exports.getAllMinorByProgram = async (req, res) => {
  try {
    const progName = req.params.progName
    const Minors = await ProgramSchema.findOne({ progName: progName });
    res.status(200).json(Minors)
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getAllStudentsByMinor = async (req, res) => {
  try {
    const minorName = req.params.minorName;
    const minor = await MinorSchema.findOne({ courseName: minorName });
    if (!minor) {
      return res.status(404).send({ message: "Minor subject not found" });
    }
    res.send({
      success: true,
      data: minor.students,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};


exports.getAllLanguages = async (req, res) => {
  try {
    const Language = await LanguagesSchema.find()
    res.send({
      success: true,
      data: Language,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getAllProfessionalCourses = async (req, res) => {
  try {
    const profCourse = await ProfessionalCourse.find()
    res.send({
      success: true,
      data: profCourse,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err,
    });
  }
};

exports.getAllStudentsByCategories = async (req, res) => {
  try {
    const { professionalcourse, language } = req.query;

    if (!professionalcourse && !language) {
      return res.status(400).json({ message: "Please provide a professional course or language to filter by." });
    }

    const filter = {};

    if (professionalcourse) {
      filter['students.professionalcourse'] = professionalcourse;
    }

    if (language) {
      filter['students.language'] = language;
    }

    const minors = await MinorSchema.find(filter);

    const students = minors.reduce((acc, minor) => {
      const filteredStudents = minor.students.filter(student => {
        if (professionalcourse && language) {
          return student.professionalcourse === professionalcourse && student.language === language;
        } else if (professionalcourse) {
          return student.professionalcourse === professionalcourse;
        } else if (language) {
          return student.language === language;
        }
      });
      return [...acc, ...filteredStudents];
    }, []);

    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;  // Use req.params for URL parameters

    // Find the student in the Minor collection by email
    const minorSubject = await MinorSchema.findOne({ "students.email": email });

    if (!minorSubject) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Extract the student data from the students array
    const student = minorSubject.students.find((stu) => stu.email === email);

    res.status(200).json({student,
      minorSubject:minorSubject.courseName
  });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateStudentByEmail = async (req, res) => {
  try {
    const { email, updatedData } = req.body;

    // Ensure only seatno can be updated
    if (!updatedData || !updatedData.seatno) {
      return res.status(400).json({ message: "Seat number is required for the update" });
    }

    // Find the minor subject document that contains the student with the specified email
    const minorSubject = await MinorSchema.findOne({ "students.email": email });

    if (!minorSubject) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the student index in the array
    const studentIndex = minorSubject.students.findIndex(stu => stu.email === email);

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the current student data
    const student = minorSubject.students[studentIndex];

    // Update only the seat number, preserving other fields
    student.seatno = updatedData.seatno;

    // Replace the old student data with the updated data
    minorSubject.students[studentIndex] = student;

    // Save the changes
    await minorSubject.save();

    res.status(200).json({ message: "Student seat number updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateStudentMemberIdByEmail = async (req, res) => {
  try {
    const { email, updatedData } = req.body;
    if (!updatedData || !updatedData.memberid) {
      return res.status(400).json({ message: "Member ID is required for the update" });
    }

    // Find the minor subject document that contains the student with the specified email
    const minorSubject = await MinorSchema.findOne({ "students.email": email });

    if (!minorSubject) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the student index in the array
    const studentIndex = minorSubject.students.findIndex(stu => stu.email === email);

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the current student data
    const student = minorSubject.students[studentIndex];

    // Update only the memberId, preserving other fields
    student.memberid = updatedData.memberid;

    // Replace the old student data with the updated data
    minorSubject.students[studentIndex] = student;

    // Save the changes
    await minorSubject.save();

    res.status(200).json({ message: "Student member ID updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deleteStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Use req.params instead of req.body for DELETE requests

    console.log(`Attempting to delete student with email: ${email}`);

    // Find the minor subject containing the student with the specified email
    const minorSubject = await MinorSchema.findOne({ "students.email": email });

    if (!minorSubject) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Filter out the student with the matching email
    const updatedStudents = minorSubject.students.filter((stu) => stu.email !== email);

    // If the student list hasn't changed, the student was not found
    if (updatedStudents.length === minorSubject.students.length) {
      console.log(`Student with email ${email} not found in the students array.`);
      return res.status(404).json({ message: "Student not found in the students array" });
    }

    // Update the Minor document with the filtered student list
    minorSubject.students = updatedStudents;
    await minorSubject.save();

    console.log(`Student with email ${email} has been deleted successfully.`);
    res.status(200).json({ message: `Student with email ${email} deleted successfully` });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};