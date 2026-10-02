import React, { useState, useEffect } from "react";
import { register } from "../actions/authActions";
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import TextField from "@mui/material/TextField";
import { Collapse } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import AdminNavbar from "../compoents/AdminNavBar";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getAllCourses } from "../actions/courseActions";
import { useNavigate } from "react-router-dom";

// add validation for seatNumber
// add subjects empty field error not displaying
// when user already exists the ui remains in add subjects page with the previous subjects array on ui (not in variable)

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [courses, setAllCourses] = useState([]);

  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectSubjectType, setSelectedSubjectType] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  // const [refresh, setRefresh] = useState(false)
  // const [availableSemesters, setAvailableSemesters] = useState([])

  useEffect(() => {
    getAllCourses().then((res) => {
      setAllCourses(res.courses.reverse());
    });
  }, []);

  const [serverError, setServerError] = useState("");

  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    seatNumber: "",
    course: "",
    semester: 0,
    subjects: [],
    subjectType: [],
    batch: [],
    error: "",
    errorMessage: "",
    role: 0,
  });

  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    seatNumber,
    course,
    semester,
    subjects,
    subjectType,
    batch,
    error,
    errorMessage,
    role,
  } = userData;

  // const [selectQueryData, setSelectQueryData] = useState({
  //   course: "",
  //   semester: 1,
  //   subjects: "",
  //   subjectType: "",
  //   batch: 1,
  // });

  useEffect(() => {
    setAvailableCourses([
      ...new Set(courses.map((subject) => subject.courseName)),
    ]);
    setAvailableSemesters([
      ...new Set(courses.map((subject) => subject.semester)),
    ]);
    setAvailableSubjects([
      ...new Set(courses.flatMap((subject) => subject.subjects)),
    ]);
  }, [courses]);

  const [openForm2, setOpenForm2] = useState(false);

  // onChange functions
  const handleUserChange = (name) => (e) => {
    setUserData((prevData) => ({
      ...prevData,
      error: "",
      errorMessage: "",
      [name]: e.target.value,
    }));
    setServerError("");
  };

  const handleCourseChange = (name, newValue) => {
    setUserData((prevData) => ({
      ...prevData,
      error: "",
      errorMessage: "",
      [name]: newValue,
    }));
    setServerError("");
  };
  
  // const handleSelectQueryChange = (name) => (e) => {
  //   setUserData((prevData) => ({ ...prevData, error: "", errorMessage: "" }));
  //   setSelectQueryData((prevData) => ({ ...prevData, [name]: e.target.value }));
  // };

  //registration functions
  const handleRegistrationUser = (e, data) => {
    e.preventDefault();
    console.log(data);
    if (data.firstName === "" || data.email === "") {
      setUserData((prevData) => ({
        ...prevData,
        error: "All fields are required ! ",
      }));
    } else if (!validateEmail(data.email)) {
      setUserData((prevData) => ({
        ...prevData,
        error: "Invalid email format. Please enter a valid email address.",
      }));
    } else {
      console.log(data);
      register(data).then((responseData) => {
        responseData.json().then((user) => {
          console.log(user);
          if (!user.success) {
            setServerError(user.message);
          } else {
            navigate("/admin-dashboard", { replace: true });
          }
        });
      });
    }
  };

  const [fieldErrors, setFieldErrors] = useState({
    // course: "",
    // semester: "",
    subjects: "",
    subjectType: "",
    batch: "",
  });

  const addToArrays = () => {
    // Basic input validation
    const newErrors = {
      // course: !selectedCourse ? "Course Name is required." : "",
      // semester: !selectedSemester ? "Semester is required." : "",
      subjects: !selectedSubject ? "Subject is required." : "",
      subjectType: !selectSubjectType ? "Type is required." : "",
      batch: !selectedBatch ? "Batch is required." : "",
    };

    if (Object.values(newErrors).some((error) => error !== "")) {
      setFieldErrors(newErrors);
      return;
    }

    // Add new item
    subjects.push(selectedSubject);
    subjectType.push(selectSubjectType);
    batch.push(selectedBatch);

    // setSelectedCourse("");
    // setSelectedSemester("");
    setSelectedSubject("");
    setSelectedSubjectType("");
    setSelectedBatch(1);
    setFieldErrors({
      // course: "",
      // semester: "",
      subjects: "",
      subjectType: "",
      batch: "",
    });
  };

  const handleRemoveSubject = (index) => {
    subjects.splice(index, 1);
    subjectType.splice(index, 1);
    batch.splice(index, 1);
  };

  //to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    getAllCourses().then((res) => {
      setAllCourses(res.courses.reverse());
    });
  }, []);

  return (
    <ProtectAdminRoute>
      <AdminNavbar />
      <div className="container-fluid d-flex flex-wrap justify-content-around py-5">
        <div
          className="col-md-5 col-10 py-5 d-flex justify-content-center align-items-start sticky-md-top"
          style={{ height: "100%" }}
        >
          <div className="col-12">
            <h2 className="text-danger text-center">Student Registration</h2>
            <div>
              <Collapse in={!openForm2}>
                <div className="py-2">
                  <div className="mb-3">
                    <TextField
                      className="col-12"
                      error={error === "userForm" ? true : false}
                      id="outlined-basic"
                      label={
                        error === "userForm"
                          ? `${errorMessage} First Name`
                          : "First Name"
                      }
                      value={firstName}
                      variant="outlined"
                      onChange={handleUserChange("firstName")}
                    />
                  </div>

                  <div className="mb-3">
                    <TextField
                      className="col-12"
                      error={error === "userForm" ? true : false}
                      id="outlined-basic"
                      label={
                        error === "userForm"
                          ? `${errorMessage} Middle Name`
                          : "Middle Name"
                      }
                      value={middleName}
                      variant="outlined"
                      onChange={handleUserChange("middleName")}
                    />
                  </div>

                  <div className="mb-3">
                    <TextField
                      className="col-12"
                      error={error === "userForm" ? true : false}
                      id="outlined-basic"
                      label={
                        error === "userForm"
                          ? `${errorMessage} Last Name`
                          : "Last Name"
                      }
                      value={lastName}
                      variant="outlined"
                      onChange={handleUserChange("lastName")}
                    />
                  </div>

                  <div className="mb-3">
                    <TextField
                      className="col-12"
                      error={
                        error === "userForm" || error === "userFormEmail"
                          ? true
                          : false
                      }
                      id="outlined-basic"
                      type="email"
                      label={
                        error === "userForm" || error === "userFormEmail"
                          ? `${errorMessage} Email`
                          : "Email"
                      }
                      value={email}
                      variant="outlined"
                      onChange={handleUserChange("email")}
                    />
                  </div>

                  <div className="mb-3">
                    <TextField
                      className="col-12"
                      error={error === "userForm" ? true : false}
                      id="outlined-basic"
                      label={
                        error === "userForm"
                          ? `${errorMessage} Seat Number`
                          : "Seat Number"
                      }
                      value={seatNumber}
                      variant="outlined"
                      onChange={handleUserChange("seatNumber")}
                    />
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={["", ...availableCourses]}
                          value={selectedCourse}
                          error={error === "userForm" ? true : false}
                          onChange={(e, newval) => {
                            setSelectedCourse(newval);
                            setSelectedSemester("");
                            handleCourseChange("course",newval);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Course" />
                          )}
                        />
                    </FormControl>
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select Semester</InputLabel>
                      <Select
                        value={selectedSemester}
                        error={error === "userForm" ? true : false}
                        label="Select Semester"
                        onChange={(e) => {
                          setSelectedSemester(e.target.value);
                          handleCourseChange("semester",e.target.value);
                        }}
                      >
                        <MenuItem value="">All Semesters</MenuItem>
                        {[
                          ...new Set(
                            courses
                              .filter((el) => el.courseName === selectedCourse)
                              .map((el) => el.semester)
                              .sort()
                          ),
                        ].map((sem) => (
                          <MenuItem key={sem} value={sem}>
                            {sem}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="py-3">
                    <button
                      className="btn col-12 btn-outline-danger"
                      onClick={() => {
                        if (
                          firstName === "" ||
                          middleName === "" ||
                          lastName === "" ||
                          email === "" ||
                          seatNumber === "" ||
                          course === "" ||
                          semester === ""
                        ) {
                          console.log({firstName,
                            middleName,
                            lastName,
                            email,
                            seatNumber,
                            course,
                            semester})
                          setUserData({
                            ...userData,
                            error: "userForm",
                            errorMessage: "Field Required",
                          });
                        } else if (!validateEmail(email)) {
                          setUserData((prevData) => ({
                            ...prevData,
                            error: "userFormEmail",
                            errorMessage:
                              "Invalid email format. Please enter a valid email address.",
                          }));
                        } else {
                          setOpenForm2(true);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </Collapse>

              <Collapse in={openForm2}>
                <div className="py-2">
                  <div className="py-3">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setOpenForm2(false)}
                    >
                      Go Back
                    </button>
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select Subject</InputLabel>
                      <Select
                        value={selectedSubject}
                        label="Select Subject"
                        onChange={(e) => {
                          setSelectedSubject(e.target.value);
                        }}
                      >
                        <MenuItem value="">All Subjects</MenuItem>
                        {[
                          ...new Set(
                            courses
                              .filter(
                                (el) =>
                                  el.courseName === selectedCourse &&
                                  el.semester === selectedSemester
                              )
                              .map((el) => el.subjects)
                          ),
                        ].map((subjects) => {
                          return subjects.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                              {subject}
                            </MenuItem>
                          ));
                        })}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select type of Subject</InputLabel>
                      <Select
                        value={selectSubjectType}
                        label="Select type of Subject"
                        onChange={(e) => setSelectedSubjectType(e.target.value)}
                      >
                        <MenuItem value="">Select Type of Subject</MenuItem>
                        <MenuItem value={"Theory"}>Theory</MenuItem>
                        <MenuItem value={"Practical"}>Practical</MenuItem>
                        <MenuItem value={"Tutorial"}>Tutorial</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select Batch</InputLabel>
                      <Select
                        value={selectedBatch}
                        label="Select Subject"
                        onChange={(e) => setSelectedBatch(e.target.value)}
                      >
                        <MenuItem value="">All Batches</MenuItem>
                        <MenuItem value={1}>{1}</MenuItem>
                        <MenuItem value={2}>{2}</MenuItem>
                        <MenuItem value={3}>{3}</MenuItem>
                        <MenuItem value={4}>{4}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="d-grid gap-2 text-center">
                    <button
                      type="button"
                      className="btn btn-danger px-4 text-center"
                      onClick={addToArrays}
                    >
                      Add subject
                    </button>
                  </div>

                  <hr />
                  {serverError !== "" ? (
                    <div className="text-center text-danger py-2">
                      {serverError}
                    </div>
                  ) : null}
                  <div className="d-grid gap-2 text-center">
                    <button
                      type="submit"
                      className="btn btn-danger px-4 text-center"
                      onClick={(e) => handleRegistrationUser(e, userData)}
                    >
                      Register Student
                    </button>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>

        <div className="col-md-5 col-10 d-flex justify-content-center align-items-center">
          <div className="col-12 p-2 fs-5">
            <p>
              <span className="fw-bold">Name: </span>
              {firstName} {middleName} {lastName}
            </p>
            <p>
              <span className="fw-bold">Email: </span>
              {email}
            </p>
            <p>
              <span className="fw-bold">Seat Number: </span>
              {seatNumber}
            </p>
            <p>
              <span className="fw-bold">Course: </span>
              {selectedCourse}
            </p>
            <p>
              <span className="fw-bold">Semester: </span>
              {selectedSemester}
            </p>

              {subjects.length === 0 ? (
                <div>No Data</div>
              ) : (
                <div>
                  {subjects.map((q, i) => (
                    <div
                      key={i}
                      className="card my-2 bg-transparent border-primary p-2"
                    >
                      <div className="d-flex flex-wrap justify-content-end">
                        <button
                          className="btn btn-danger btn-sm col-2"
                          onClick={() => handleRemoveSubject(i)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="">
                        <div>
                          <span className="fw-bold">Subject: </span>
                          {subjects[i]}
                        </div>
                        <div>
                          <span className="fw-bold">Subject Type: </span>
                          {subjectType[i]}
                        </div>
                        <div>
                          <span className="fw-bold">Batch: </span>
                          {batch[i]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </ProtectAdminRoute>
  );
};

export default RegisterStudent;