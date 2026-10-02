import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  getStudentByEmail, updateStudentByEmail, updateStudentMemberIdByEmail,
  deleteStudentByEmail,
} from "../actions/formActions";
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import AdminNavBar from "../compoents/AdminNavBar";

const UpdateMinorStudent = () => {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState("");
  const [seatno, setSeatno] = useState("");
  const [memberid, setMemberId] = useState("");
  const [studentData, setStudentData] = useState(null); // Store fetched student details
  const [minorSubject, setMinorSubject] = useState(""); // Store minor subject
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // CSV Handling
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleParse = () => {
    if (!file) return setError("Please upload a CSV file.");

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setStudents(result.data);
        setError(null);
      },
      error: (err) => {
        setError("Error parsing CSV file.");
      },
    });
  };

  const handleBatchUpdate = async () => {
    let updatedCount = 0;

    for (const student of students) {
      const { email, seatno } = student;

      try {
        await getStudentByEmail(email);
        await updateStudentByEmail(email, { seatno });
        updatedCount++;
        setProgress((updatedCount / students.length) * 100);
      } catch (err) {
        console.error(`Error updating student with email ${email}: ${err}`);
        setError(`Failed to update student with email: ${email}`);
      }
    }

    alert("Batch update completed.");
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const seatnoRegex = /^\d{11}$/;
  const memberIdRegex = /^\d{10}$/;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFetchStudent = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const { student, minorSubject } = await getStudentByEmail(email);
      setStudentData(student); // Save the fetched student data
      setMinorSubject(minorSubject); // Save the minor subject
      setError(null);
    } catch (err) {
      setError("Failed to fetch student data");
    }
  };

  const handleSeatnoChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setSeatno(value);
    }
  };

  const handleMemberIdChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMemberId(value);
    }
  };

  const handleUpdateStudentSeatNumber = async () => {
    if (!seatnoRegex.test(seatno)) {
      setError("Invalid seat number. Must be 11 digits.");
      return;
    }

    try {
      await updateStudentByEmail(email, { seatno });
      setError(null);
      alert("Seat number updated successfully");
    } catch (err) {
      setError("Failed to update student data");
      alert("Failed to update student");
    }
  };

  const handleUpdateStudentMemberIdByEmail = async () => {
    if (!memberIdRegex.test(memberid)) {
      setError("Invalid member ID. Must be 10 digits.");
      return;
    }

    try {
      await updateStudentMemberIdByEmail(email, { memberid });
      setError(null);
      alert("Member ID updated successfully");
    } catch (err) {
      setError("Failed to update student data");
      alert("Failed to update student");
    }
  };

  const handleDeleteStudent = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudentByEmail(email);
        alert("Student deleted successfully");
        setStudentData(null); // Clear student data after deletion
        setEmail("");
        setSeatno("");
        setError(null);
      } catch (err) {
        setError("Failed to delete student");
        alert("Failed to delete student");
      }
    }
  };

  return (
    <ProtectAdminRoute>
      <AdminNavBar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Single Student Update */}
        <div style={{ padding: "20px", width: "80%", maxWidth: "1200px" }}>
          <h2 style={{ textAlign: "center" }}>Update Single Student</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 30%", margin: "10px" }}>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                style={{ width: "100%", padding: "10px" }}
              />
              <br />
              <button
                className="btn btn-danger"
                style={{ marginTop: "1vh", width: "100%" }}
                onClick={handleFetchStudent}
              >
                Fetch
              </button>
            </div>

            <div style={{ flex: "1 1 30%", margin: "10px" }}>
              <input
                type="text"
                value={memberid}
                onChange={handleMemberIdChange}
                placeholder="Enter member ID (10 digits)"
                style={{ width: "100%", padding: "10px" }}
              />
              <button
                className="btn btn-danger"
                style={{ marginTop: "1vh", width: "100%" }}
                onClick={handleUpdateStudentMemberIdByEmail}
              >
                Update Member ID
              </button>
            </div>

            <div style={{ flex: "1 1 30%", margin: "10px" }}>
              <input
                type="text"
                value={seatno}
                onChange={handleSeatnoChange}
                placeholder="Enter seat number (11 digits)"
                style={{ width: "100%", padding: "10px" }}
              />
              <br />
              <button
                className="btn btn-danger"
                style={{ marginTop: "1vh", width: "100%" }}
                onClick={handleUpdateStudentSeatNumber}
              >
                Update Student
              </button>
            </div>
          </div>

          {studentData && (
            <div style={{ marginTop: "20px" }}>
              <h3>Fetched Student Details:</h3>
              <table border="1" cellPadding="5" style={{ width: "100%", wordBreak: "break-word" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Seat No</th>
                    <th>Phone No</th>
                    <th>Program</th>
                    <th>Prof Course</th>
                    <th>Lang</th>
                    <th>Member</th> 
                    <th>Minor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{studentData.name}</td>
                    <td>{studentData.email}</td>
                    <td>{studentData.seatno}</td>
                    <td>{studentData.mobileno}</td>
                    <td>{studentData.programName}</td>
                    <td>{studentData.professionalcourse}</td>
                    <td>{studentData.language}</td>
                    <td>{studentData.memberid}</td>
                    <td>{minorSubject}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="btn btn-danger"
              style={{ marginTop: "15px" }}
              onClick={handleDeleteStudent}
            >
              Delete Student
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </div>

        {/* Batch Update */}
        <div style={{ padding: "20px", width: "80%", maxWidth: "1200px" }}>
          <h2>Batch Update Students from CSV</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="file"
            onChange={handleFileChange}
            style={{ width: "100%" }}
          />
          <button onClick={handleParse}>Parse CSV</button>
          <button onClick={handleBatchUpdate}>Update Students</button>
          <p>Progress: {progress}%</p>
        </div>
      </div>

    </ProtectAdminRoute>
  );
};

export default UpdateMinorStudent;
