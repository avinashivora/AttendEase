import { ProtectTeacherRoute } from "../manageRoutes/ProtectRoutes"
import { register } from "../actions/authActions"
import React, { useState, useEffect } from "react"
import { Collapse } from "@mui/material";
import { useAuthStore } from "../store/store";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import TeacherNavBar from "../compoents/TeacherNavBar";



const AddNewStudent = () => {

    const navigate = useNavigate();
    const userDataFromState = useAuthStore.getState().userData

    const [openForm2, setOpenForm2] = useState(false)

    const [userData, setUserData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "somaiya",
        error: "",
        errorMessage: "",
        role: 0,
        course: "",
        semester: "",
        seatNumber: "",
        subjects: []
    })

    const {
        error,
        errorMessage

    } = userData;

    const [subject, setSubject] = React.useState("");

    const handleUserChange = (e) => {
        setUserData(prevData => ({ ...prevData, error: '', errorMessage: '', [e.target.name]: e.target.value }))
    }


    const handleAddToSubjects = () => {
        const tempSubject = userData.subjects;
        tempSubject.push(subject)
        setUserData(prevData => ({ ...prevData, error: '', errorMessage: '', subject: tempSubject }))
        setSubject("")
    }

    const handleUserRegistration = (e, data) => {

        e.preventDefault()
        if (data.firstName === "" || data.middleName === "" || data.lastName === "" || data.email === "") {
            setUserData(prevData => ({ ...prevData, error: "All fields are required ! " }))
        }
        else if (!validateEmail(data.email)) {

            setUserData(prevData => ({ ...prevData, error: "userFormEmail", errorMessage: 'Invalid email format. Please enter a valid email address.' }))
        }
        else {
            register(data).then(responseData => {
                responseData.json().then(user => {
                    console.log(user)
                    return user
                })
            })
            setOpenForm2(false)
            setUserData(
                prevData => (
                    {
                        ...prevData,
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        email: "",
                        password: "somaiya",
                        error: "",
                        errorMessage: "",
                        role: 0,
                        course: "",
                        semester: "",
                        seatNumber: "",
                        subjects: []
                    }
                )
            )
            navigate('/teacher-dashboard/add-new-student');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <ProtectTeacherRoute>
            <TeacherNavBar />
            <div className="container col-md-6 col-10 mt-5">
                <Collapse in={!openForm2}>

                    <h2 className='text-danger text-center mb-3'>Student Registration</h2>
                    <form>

                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} First Name` : "First Name"}
                                value={userData.firstName}
                                name="firstName"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} Middle Name` : "Middle Name"}
                                value={userData.middleName}
                                name="middleName"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} Last Name` : "Last Name"}
                                value={userData.lastName}
                                name="lastName"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "userFormEmail" || error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userFormEmail' || error === "userForm" ? `${errorMessage} Email Id` : "Email Id"}
                                value={userData.email}
                                name="email"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} Course` : "Course"}
                                value={userData.course}
                                name="course"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                type="number"
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} Semester` : "Semester"}
                                value={userData.semester}
                                name="semester"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        <div className="mb-3">
                            <TextField
                                type="number"
                                className="col-12"
                                error={error === "userForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'userForm' ? `${errorMessage} Seat Number` : "Seat Number"}
                                value={userData.seatNumber}
                                name="seatNumber"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)}
                            />
                        </div>

                        <div className='d-grid gap-2 text-center'>
                            <button type="button" className="btn btn-danger px-4 text-center" onClick={() => {
                                if (userData.firstName === "" || userData.middleName === "" || userData.lastName === "" || userData.email === "" || userData.course === "" || userData.semester === "" || userData.seatNumber === "") {
                                    setUserData({ ...userData, error: 'userForm', errorMessage: '* Required Field ' })
                                }
                                else if (!validateEmail(userData.email)) {
                                    setUserData(prevData => ({ ...prevData, error: "userFormEmail", errorMessage: 'Invalid email format. Please enter a valid email address.' }))
                                } else {
                                    setOpenForm2(true)
                                }
                            }}>
                                Next
                            </button>
                        </div>
                    </form>


                </Collapse>

                <Collapse in={openForm2}>

                    <h2 className='text-danger text-center mb-3'>Add Subjects</h2>

                    <button type="button" className="btn btn-danger px-4 text-center mb-4" onClick={() => setOpenForm2(false)}>
                        Go back
                    </button>

                    <div className="mb-3">
                        <TextField
                            className="col-12"
                            error={error === "queryForm" ? true : false}
                            id="outlined-basic"
                            label={error === 'queryForm' ? `${errorMessage} Subject Name` : "Subject Name"}
                            value={subject}
                            name="subject"
                            variant="outlined"
                            onChange={(e) => setSubject(e.target.value)} />
                    </div>

                    <div className='d-grid gap-2 text-center mb-3'>
                        <button type="button" className="btn btn-danger px-4 text-center" onClick={() => {
                            if (subject === "") {
                                setUserData({ ...userData, error: 'queryForm', errorMessage: '* Required Field ' })
                            } else {
                                handleAddToSubjects()
                            }
                        }}>Add Subject</button>
                    </div>

                    <div className='d-grid gap-2 text-center mb-3'>
                        <button type="submit" className="btn btn-danger px-4 text-center" onClick={(e) => handleUserRegistration(e, userData)}>Register</button>
                    </div>

                </Collapse>

            </div>
        </ProtectTeacherRoute>
    );
};

export default AddNewStudent