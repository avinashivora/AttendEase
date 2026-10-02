import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
  getAllMinorByProgram,
  createStudent,
  getAllPrograms,
  getOneMinor,
  getAllLanguages,
  getAllProfessionalCourses,
} from "../actions/formActions";

const MinorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    memberID: "",
    seatNum: "",
    program: "",
    phoneNum: "",
    profCourse: "",
    langCourse: "",
    minorCourse: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    memberID: "",
    seatNum: "",
    phoneNum: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [cap, setCap] = useState();
  const [minorCourseMenuEl, setMinorCourseMenuEl] = useState([]);
  const [programMenuEl, setProgramMenuEl] = useState([]);
  const [langCourseList, setlang] = useState([]);
  const [profCourseList, setProfCourse] = useState([]);

  useEffect(() => {
    updateChange();
    fetchMinorDetails(formData.minorCourse);
    fetchLanguages();
    fetchProfCourses();
  }, [formData.minorCourse]);
  useEffect(() => {
    fetchData(formData.program);
  }, [formData.program]);
  useEffect(() => {
    setErrors(validateDetails());
  }, [formData]);
  useEffect(() => {
    fetchProgramData();
  }, []);

  const SimpleAlert = (alertMsg, paraSeverity) => {
    setAlertMessage(alertMsg);
    setSeverity(paraSeverity);
    setAlertOpen(true);
  };

  function handleAlertClose() {
    setAlertOpen(false);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === "seatNum" ? value.replace(/^0+/, '') || 0 : value

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };

  const updateChange = async () => {
    try {
      const res = await getAllMinorByProgram(formData.program);
      res.minor.forEach((item) => {
        if (item.courseName === formData.minorCourse) {
          setCap(item.remainingCapacity);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    // Combine all field checks into a single if statement
    if (
      formData.memberID !== null &&
      formData.memberID.trim() !== "" &&
      formData.email !== null &&
      formData.email.trim() !== "" &&
      formData.seatNum !== null &&
      formData.seatNum.trim() !== "" &&
      formData.name !== null &&
      formData.name.trim() !== "" &&
      formData.phoneNum !== null &&
      formData.phoneNum.trim() !== "" &&
      formData.langCourse !== null &&
      formData.langCourse.trim() !== "" &&
      formData.profCourse !== null &&
      formData.profCourse.trim() !== "" &&
      formData.minorCourse !== null &&
      formData.minorCourse.trim() !== ""
    ) {
      // All fields are valid, proceed with student creation
      let error = true;
      let msg;
      for (const [, value] of Object.entries(errors)) {
        if (value.length > 0) {
          error = false;
          msg = value;
          break;
        }
      }

      if (cap > 0 && error) {
        const data = {
          name: formData.name,
          email: formData.email,
          seatno: formData.seatNum,
          mobileno: formData.phoneNum,
          memberid: formData.memberID,
          programName: formData.program,
          professionalcourse: formData.profCourse,
          language: formData.langCourse,
          minorSubject: formData.minorCourse,
        };

        createStudent(JSON.stringify(data)).then((res) => {
          if (res.success) {
            updateChange();
            setCap((prevCap) => prevCap - 1);
            setFormData({
              name: "",
              email: "",
              memberID: "",
              seatNum: "",
              program: "",
              phoneNum: "",
              profCourse: "",
              langCourse: "",
              minorCourse: "",
            });
            setCap(null);
            SimpleAlert(
              `Successfully Enrolled in ${formData.minorCourse} course.`,
              "success"
            );
          } else {
            SimpleAlert(res.message, "error");
          }
        });
      } else {
        if (msg === undefined) {
          SimpleAlert("Fill Information in all the Fields", "error");
        } else {
          SimpleAlert("Type: " + msg, "error");
        }
      }
    } else {
      // At least one field is invalid, provide a general error message
      SimpleAlert("Enter all fields correctly.", "error");
    }
  };

  const fetchCapacity = async (minor) => {
    try {
      const res = await getOneMinor(minor);
      return res.remainingCapacity;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMinorDetails = async (minor) => {
    try {
      const res = await getOneMinor(minor);
      setCap(res.remainingCapacity);
      setMinorCourseMenuEl((prevMinorCourseMenuEl) =>
        prevMinorCourseMenuEl.map((item) =>
          item.value === minor
            ? { ...item, disabled: res.remainingCapacity <= 0 }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await getAllLanguages();
      const languageList = res.data.map((item) => item.langCourseList);
      setlang(languageList);
    } catch (err) {
      console.error("error getting languages", err);
    }
  };

  const fetchProfCourses = async () => {
    try {
      const res = await getAllProfessionalCourses();
      const profCourseData = res.data.map((item) => item.profCourse);
      setProfCourse(profCourseData);
    } catch (err) {
      console.error("error getting programs", err);
    }
  };

  const fetchProgramData = async () => {
    try {
      const res = await getAllPrograms();
      const programList = res.data.map((item) => ({
        value: item.progName,
        label: item.progName, // Assuming progName is both value and label
      }));
      setProgramMenuEl(programList);
    } catch (error) {
      console.error(error);
    }
  };

  const validateDetails = () => {
    let errors = {
      name: "",
      email: "",
      memberID: "",
      seatNum: "",
      phoneNum: "",
    };
    if (formData.name.length > 0) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(formData.name)) {
        errors.name = "❗Are you typing your name correctly?";
      }
    }
    if (formData.email.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "❗Are you typing your somaiya email correctly?";
      }
    }
    if (formData.memberID.length > 0) {
      const memberIDRegex = /^\d{10}$/;
      if (!memberIDRegex.test(formData.memberID))
        errors.memberID = "❗Are you typing your member ID correctly?";
    }
    if (formData.seatNum.length > 0) {
      const seatNumRegex = /^\d{11}$/;
      if (!seatNumRegex.test(formData.seatNum))
        errors.seatNum = "❗Are you typing your seat number correctly?";
    }

    if (formData.phoneNum.length > 0) {
      const phoneNumRegex = /^\d{10}$/;
      if (!phoneNumRegex.test(formData.phoneNum))
        errors.phoneNum = "❗Are you typing your phone number correctly?";
    }

    return errors;
  };

  const fetchData = async (progName) => {
    try {
      // Fetch the minors
      const res = await getAllMinorByProgram(progName);

      // Fetch capacities and transform data for the menu
      const dataMinor = await Promise.all(
        res.minor.map(async (minorName) => {
          const minorCap = await fetchCapacity(minorName);
          return { minorName, minorCap };
        })
      );

      setMinorCourseMenuEl(dataMinor);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-center fs-1 py-md-5 py-3">Minor Selection Form</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="col-md-6 col-10">
          <label htmlFor="name" className="form-label">
            Enter your Name:
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={{
              marginBottom: "3vh",
              border: errors.name ? "3px solid red" : "1px solid #ced4da",
              boxShadow: errors.name
                ? "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
                : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            }}
            placeholder="Enter Name"
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

          <label htmlFor="email" className="form-label">
            Enter your Email:
          </label>
          <input
            id="email"
            name="email"
            className="form-control"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              marginBottom: "3vh",
              border: errors.email ? "3px solid red" : "1px solid #ced4da",
              boxShadow: errors.email
                ? "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
                : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            }}
            placeholder="Somaiya Email"
            required
          />
          {errors.email.length > 0 && (
            <p style={{ color: "red" }}>{errors.email}</p>
          )}

          <label htmlFor="memberID" className="form-label">
            Enter your ID No:
          </label>
          {
            <sup>
              <span className="text-success">On your ID Card</span>
            </sup>
          }
          <input
            id="memberID"
            name="memberID"
            className="form-control"
            type="text"
            value={formData.memberID}
            onChange={handleChange}
            style={{
              marginBottom: "3vh",
              border: errors.memberID ? "3px solid red" : "1px solid #ced4da",
              boxShadow: errors.memberID
                ? "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
                : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            }}
            placeholder="Enter ID No:"
            required
          />
          {errors.memberID.length > 0 && (
            <p style={{ color: "red" }}>{errors.memberID}</p>
          )}

          <label htmlFor="seatNum" className="form-label">
            Enter your Seat Number:
          </label>
          <input
            id="seatNum"
            name="seatNum"
            className="form-control"
            type="text"
            value={formData.seatNum}
            onChange={handleChange}
            style={{
              marginBottom: "3vh",
              border: errors.seatNum ? "3px solid red" : "1px solid #ced4da",
              boxShadow: errors.seatNum
                ? "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
                : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            }}
            placeholder="Enter Seat Number (11 digit)"
            required
          />
          {errors.seatNum.length > 0 && (
            <p style={{ color: "red" }}>{errors.seatNum}</p>
          )}

          <label htmlFor="program" className="form-label">
            Select your Program:
          </label>
          <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Program</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="program"
                value={formData.program}
                label="program"
                name="program"
                onChange={handleChange}
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Adjust as needed
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null,
                }}
              >
                {programMenuEl.map((item, index) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    style={{ whiteSpace: "normal" }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <label htmlFor="phoneNum" className="form-label">
            Enter your Phone Number:
          </label>
          <input
            id="phoneNum"
            name="phoneNum"
            className="form-control"
            type="text"
            value={formData.phoneNum}
            onChange={handleChange}
            style={{
              marginBottom: "3vh",
              border: errors.phoneNum ? "3px solid red" : "1px solid #ced4da",
              boxShadow: errors.phoneNum
                ? "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
                : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            }}
            placeholder="Enter your Phone Number"
            required
          />
          {errors.phoneNum.length > 0 && (
            <p style={{ color: "red" }}>{errors.phoneNum}</p>
          )}

          <label htmlFor="minorCourse" className="form-label">
            Select Minor Course:
          </label>
          {formData.program === "" && (
            <sup>
              <span className="text-danger">*First Select Your Program</span>
            </sup>
          )}
          <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Minor</InputLabel>
              <Select
                disabled={formData.program === "" ? true : false}
                labelId="demo-simple-select-label"
                id="minorCourse"
                value={formData.minorCourse}
                label="minorCourse"
                name="minorCourse"
                onChange={handleChange}
                required
              >
                {minorCourseMenuEl.map((option, index) => (
                  <MenuItem
                    sx={{
                      whiteSpace: "normal",
                    }}
                    key={index}
                    value={option.minorName}
                    disabled={option.minorCap == 0}
                  >
                    {option.minorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {cap && (
            <div
              style={{
                marginTop: "-30px",
                marginBottom: "30px",
                fontWeight: "bold",
              }}
            >
              Available Seats: {cap}
              <br />
            </div>
          )}

          <label htmlFor="profCourse" className="form-label">
            Select Professional Course:
          </label>
          <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Professional
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="profCourse"
                value={formData.profCourse}
                label="profCourse"
                name="profCourse"
                onChange={handleChange}
                required
              >
                {profCourseList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <label htmlFor="langCourse" className="form-label">
            Select Language Course:
          </label>
          <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Language</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="langCourse"
                value={formData.langCourse}
                label="langCourse"
                name="langCourse"
                onChange={handleChange}
                required
              >
                {langCourseList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <button onClick={() => handleSubmit()} className="btn btn-primary">
            Submit
          </button>
        </div>
        <Dialog open={alertOpen} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity={severity}>
            {alertMessage}
          </Alert>
        </Dialog>
      </div>
    </>
  );


  ///////////////////// when the form is closed////////////////////////////////

  //   const [close,setClose] = useState(true)


  //     return (
  //       <Dialog open={close} >
  //         <DialogTitle className="text-danger text-center text-uppercase font-weight-bold">Portal Closed</DialogTitle>
  //         <DialogContent className="text-center">
  //           The portal for selecting minor subjects is now closed. Thank you for your participation!
  //           <br />
  //           If you have not filled out the form, please contact your teacher for further details.
  //             <br />
  //             Your teacher will assist you with the next steps.
  //         </DialogContent>
  //       </Dialog>
  //     );
}



export default MinorForm;
