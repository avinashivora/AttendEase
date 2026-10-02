// UI/UX -> UI and UX
// Financial Markets -> Financial Markets
//

const mongoose = require("mongoose");
const Minor = require("../../models/minorSchema");
const ProgramSchema = require("../../models/programSchema");
const programdata = require("../../productionData/MinorData/programdata.json");

// Replace with your actual connection string
const mongoURI = "mongodb://0.0.0.0:27017/attendance-v1";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function updateMinor() {
  await Minor.updateOne(
    { courseName: "Minor in Finance" }, // Find the document with the old course name
    { $set: { capacity: 61, remainingCapacity: 1 } } // Update the capacity and remaining capacity
  );
}

async function AddStudent(){

  const student = {
    name: "Nitya Jagat Sanghavi",
    email: "nitya.sanghavi@somaiya.edu",
    seatno: "31010424064",
    mobileno: "1234567890", // Replace with an actual mobile number
    memberid: "5987415236",
    programName: "Finance",
    professionalcourse: "Professional Communication",
    language: "Not Interested",
  };


  const courseName = "Minor in Finance"; // Replace with the actual course name if necessary
  const minorSubject = await Minor.findOne({ courseName });

  if (minorSubject) {
    // Add the student to the students array
    minorSubject.students.push(student);

    // Decrement the remaining capacity
    minorSubject.remainingCapacity -= 1;

    // Save the updated minor subject
    await minorSubject.save();
    console.log("Student added successfully!");
  } else {
    console.log("Course not found.");
  }

  // Close the database connection
  await mongoose.connection.close();
}

async function updatePrograms() {
  await ProgramSchema.collection.drop();
  await ProgramSchema.create(programdata);
  console.log("New program data imported");
}

async function removeStudents(courseName, emails) {
  try {
    const course = await Minor.findOne({ courseName: courseName });

    if (!course) {
      throw new Error("Course not found");
    }

    emails.forEach((email) => {
      course.students = course.students.filter(
        (student) => student.email !== email
      );
    });

    course.remainingCapacity = course.capacity - course.students.length;
    await course.save();

    console.log("Students removed and remaining capacity updated successfully");
  } catch (error) {
    console.error("Error removing students:", error);
  }
}

const courseName = "Minor in Cyber Security"; // Replace with the actual course name
const courseName1 = "Minor in Marketing";
const emails = ["sunitay1521@somaiya.edu", "s.kabra@somaiya.edu"];

async function interChangeSeatNo() {
  const firstUpdate = await Minor.updateOne(
    { "students.seatno": "31010424064" },
    { $set: { "students.$.seatno": "31010424062" } },
    { new: true }
  );
  console.log(firstUpdate);

  const secondUpdate = await Minor.updateOne(
    { "students.seatno": "31010724089" },
    { $set: { "students.$.seatno": "31010724090" } },
    { new: true }
  );
  console.log(secondUpdate);
}

const insertMany = async () => {
  try {
    // await updatePrograms();
    // await interChangeSeatNo();
    // await removeStudents(courseName, emails)
    // await removeStudents(courseName1, emails)
    await updateMinor()
    await AddStudent()
      .then(() => mongoose.disconnect()) // Disconnect from MongoDB after operation
      .catch((err) => console.error(err));
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

insertMany();
