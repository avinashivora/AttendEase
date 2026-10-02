import React, { useState, useEffect } from "react";
import { register } from "./../actions/authActions";
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import TextField from "@mui/material/TextField";
import { Collapse } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import AdminNavbar from "../compoents/AdminNavBar";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getAllCourses } from "../actions/courseActions";
import { useNavigate } from "react-router-dom";
const RegisterTeacher = () => {
  const navigate = useNavigate();
  const [courses, setAllCourses] = useState([]);

  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectSubjectType, setSelectSubjectType] = useState("");
  // const [refresh, setRefresh] = useState(false)
  // const [availableSemesters, setAvailableSemesters] = useState([])

  const [selectedBatch, setSelectedBatch] = useState("");
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
    error: "",
    errorMessage: "",
    visitingFaculty: false,
    isActive: false,
    selectQuery: [],
    role: 1,
  });

  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    error,
    errorMessage,
    visitingFaculty,
    isActive,
    selectQuery,
    role,
  } = userData;

  const [selectQueryData, setSelectQueryData] = useState({
    course: "",
    semester: 1,
    subjects: "",
    subjectType: "",
    batch: 1,
  });

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

  const [updateIndex, setUpdateIndex] = useState();

  const { course, semester, subject, batch } = selectQueryData;

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
  const handleSelectQueryChange = (name) => (e) => {
    setUserData((prevData) => ({ ...prevData, error: "", errorMessage: "" }));
    setSelectQueryData((prevData) => ({ ...prevData, [name]: e.target.value }));
  };

  const handleCheckboxChange = (fieldName) => () => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: !prevUserData[fieldName],
    }));
  };

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
    courseName: "",
    semester: "",
    subject: "",
    type: "",
    batch: "",
  });

  // const addToSelectQuery = () => {

  //     let tempSelectQuery = selectQuery
  //     tempSelectQuery.push({
  //         course: selectedCourse,
  //         semester: selectedSemester,
  //         subject: selectedSubject,
  //         batch: selectedBatch
  //     })
  //     console.log(tempSelectQuery)
  //     setUserData(prevData => {
  //         return {
  //             ...prevData,
  //             selectQuery: tempSelectQuery
  //         }
  //     })
  // }

  const addToSelectQuery = () => {
    // Basic input validation
    const newErrors = {
      courseName: !selectedCourse ? "Course Name is required." : "",
      semester: !selectedSemester ? "Semester is required." : "",
      subject: !selectedSubject ? "Subject is required." : "",
      type: !selectSubjectType ? "Type is required." : "",
      batch: !selectedBatch ? "Batch is required." : "",
    };

    if (Object.values(newErrors).some((error) => error !== "")) {
      setFieldErrors(newErrors);
      return;
    }

    let tempSelectQuery = selectQuery;
    // Add new item
    tempSelectQuery.push({
      course: selectedCourse,
      semester: selectedSemester,
      subjects: selectedSubject,
      subjectType: selectSubjectType,
      batch: selectedBatch,
    });

    setUserData((prevData) => {
      return {
        ...prevData,
        selectQuery: tempSelectQuery,
      };
    });

    setSelectedCourse("");
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedBatch(1);
    setFieldErrors({
      courseName: "",
      semester: "",
      subject: "",
      type: "",
      batch: "",
    });
  };

  const handleRemoveQuery = (index) => {
    const updatedSelectQuery = [...userData.selectQuery];
    updatedSelectQuery.splice(index, 1);
    setUserData({ ...userData, selectQuery: updatedSelectQuery });
  };

  //to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // useEffect(() => {
  //     if (selectedCourse === 'all') {
  //         // If 'All Courses' is selected, show all unique semesters
  //         setAvailableSemesters([...new Set(courses.map(subject => subject.semester))]);
  //     } else {
  //         // If a specific course is selected, show only semesters available in that course
  //         setAvailableSemesters(
  //             [...new Set(courses.filter(subject => subject.courseName === selectedCourse).map(subject => subject.semester))]
  //         );
  //     }
  // }, [selectedCourse, courses]);

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
            <h2 className="text-danger text-center">Teacher Registration</h2>
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
                  <div className="py-3">
                    <button
                      className="btn col-12 btn-outline-danger"
                      onClick={() => {
                        if (
                          firstName === "" ||
                          middleName === "" ||
                          lastName === "" ||
                          email === ""
                        ) {
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
                      <div className="mb-3">
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={["", ...availableCourses]}
                          value={selectedCourse}
                          onChange={(event, newValue) => {
                            setSelectedCourse(
                              newValue === "" ? null : newValue
                            );
                            setSelectedSemester(selectedSemester);
                            setSelectedSubject(selectedSubject);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Course" />
                          )}
                        />
                        {fieldErrors.courseName && (
                          <div style={{ color: "red" }}>
                            {fieldErrors.courseName}
                          </div>
                        )}
                      </div>
                      {fieldErrors.courseName && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.courseName}
                        </div>
                      )}
                    </FormControl>
                  </div>

                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select Semester</InputLabel>
                      <Select
                        value={selectedSemester}
                        label="Select Semester"
                        onChange={(e) => {
                          setSelectedSemester(e.target.value);
                          setSelectedSubject("");
                        }}
                      >
                        <MenuItem value="">All Semesters</MenuItem>
                        {[
                          ...new Set(
                            courses
                              .filter((el) => el.courseName === selectedCourse)
                              .map((el) => el.semester)
                          ),
                        ].map((sem) => (
                          <MenuItem key={sem} value={sem}>
                            {sem}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.semester && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.semester}
                        </div>
                      )}
                    </FormControl>
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
                      {fieldErrors.subject && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.subject}
                        </div>
                      )}
                    </FormControl>
                  </div>
                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel>Select type of Subject</InputLabel>
                      <Select
                        value={selectSubjectType}
                        label="Select type of Subject"
                        onChange={(e) => setSelectSubjectType(e.target.value)}
                      >
                        <MenuItem value="">Select Type of Subject</MenuItem>
                        <MenuItem value={"Theory"}>Theory</MenuItem>
                        <MenuItem value={"Practical"}>Practical</MenuItem>
                        <MenuItem value={"Tutorial"}>Tutorial</MenuItem>
                      </Select>
                      {fieldErrors.type && (
                        <div style={{ color: "red" }}>{fieldErrors.type}</div>
                      )}
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
                      {fieldErrors.batch && (
                        <div style={{ color: "red" }}>{fieldErrors.batch}</div>
                      )}
                    </FormControl>
                  </div>

                  <div className="d-grid gap-2 text-center">
                    <button
                      type="button"
                      className="btn btn-danger px-4 text-center"
                      onClick={addToSelectQuery}
                    >
                      Add subjects
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
                      Register Teacher
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
            {/* {JSON.stringify(visitingFaculty)}
                        {JSON.stringify(isActive)} */}
            <div>
              {selectQuery.length === 0 ? (
                <div>No Data</div>
              ) : (
                <div>
                  {selectQuery.map((q, i) => (
                    <div
                      key={i}
                      className="card my-2 bg-transparent border-primary p-2"
                    >
                      <div className="d-flex flex-wrap justify-content-end">
                        <button
                          className="btn btn-danger btn-sm col-2"
                          onClick={() => handleRemoveQuery(i)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="">
                        <div>
                          <span className="fw-bold">Course: </span>
                          {q.course}
                        </div>
                        <div>
                          <span className="fw-bold">Semester: </span>
                          {q.semester}
                        </div>
                        <div>
                          <span className="fw-bold">Subject: </span>
                          {q.subjects}
                        </div>
                        <div>
                          <span className="fw-bold">Subject Type: </span>
                          {q.subjectType}
                        </div>
                        <div>
                          <span className="fw-bold">Batch: </span>
                          {q.batch}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectAdminRoute>
  );
};

export default RegisterTeacher;
