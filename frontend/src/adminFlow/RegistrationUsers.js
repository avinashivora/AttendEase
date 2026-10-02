import React , { useState } from "react";
import {Collapse} from "@mui/material"
import {register} from "./../actions/authActions"
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import TextField from "@mui/material/TextField";
import AdminNavBar from "../compoents/AdminNavBar";

const RegisterUsers = () => {
    
    // const [firstName, setFirstName] = useState('');
    // const [middleName, setMiddleName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    
    const [userData,setUserData] = useState({
        firstName : "",
        middleName : "",
        lastName : "",
        email: "",
        password : "somaiya",
        error : "",
        errorMessage : ""
    })

    const {
        error,
        errorMessage
    } = userData;
    
    const [teacherData,setTeacherData] = useState({
        course : "",
        semester : "",
        subject : "",
        teacherError : "",
        teacherErrorMessage : ""
    })

    const {
        teacherError,
        teacherErrorMessage
    } = teacherData;


    const [open,setOpen] = useState(false)

    // onChange functions
    const handleUserChange = (e) => {
        setUserData(prevData => ({...prevData, error: '', errorMessage:'' ,[e.target.name]:e.target.value}))
    }
    
    const handleTeacherChange = (e) => {
        setTeacherData(prevData => ({...prevData, teacherError: '',teacherErrorMessage:'' ,[e.target.name]:e.target.value}))
    }

    //registration functions
    const handleRegistrationUser = (e,data) => {
        e.preventDefault()
        if(data.firstName === "" || data.middleName==="" || data.lastName==="" || data.email===""){
            setUserData({ ...userData, error: 'userForm', errorMessage: '* Required Field ' })
        }
        else if (!validateEmail(data.email)){
            setUserData({ ...userData, error: 'userFormEmail', errorMessage: 'Invalid Email Format. Please Enter a valid' })
        }
        else{
            register(data).then(responseData => {
                responseData.json().then(user =>{
                    console.log(user)
                    if(user.success){   
                        setOpen(true);
                    }
                    else if(user.message === "User already exists"){
                        setUserData({ ...userData, error: 'userFormEmail', errorMessage: user.message + ". Please Enter another" })
                    }
                    return user
                })
            })
        }
    };

    const handleTeacherRegistration = (e,data) => {
        e.preventDefault()
        if(data.course === "" || data.subject==="" || data.semester===""){
            setTeacherData({ ...teacherData, teacherError: 'teacherForm', teacherErrorMessage: '* Required Field ' })
        }
        else {
             //register tecaher code
        }
    } 
    
    //to validate email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    return(
        <ProtectAdminRoute>
            <AdminNavBar/>
        <div className="container col-md-6 col-10 mt-5  p-5">
            <Collapse in={!open}>            
            <h2 className='text-danger text-center mb-4'>User Registration</h2>
            <form>
                <div className="mb-3">
                    <TextField
                        className="col-12"
                        error={error === "userForm" ? true : false}
                        id="outlined-basic"
                        label={error === 'userForm' ? `${errorMessage} First Name` : "First Name"}
                        value={userData.firstName}
                        name = "firstName"
                        variant="outlined"
                        onChange={(e)=>handleUserChange(e)} />
                </div>
                <div className="mb-3">
                    <TextField
                        className="col-12"
                        error={error === "userForm" ? true : false}
                        id="outlined-basic"
                        label={error === 'userForm' ? `${errorMessage} Middle Name` : "Middle Name"}
                        value={userData.middleName}
                        name = "middleName"
                        variant="outlined"
                        onChange={(e)=>handleUserChange(e)} />
                </div>
                <div className="mb-3">
                    <TextField
                        className="col-12"
                        error={error === "userForm" ? true : false}
                        id="outlined-basic"
                        label={error === 'userForm' ? `${errorMessage} Last Name` : "Last Name"}
                        value={userData.lastName}
                        name = "lastName"
                        variant="outlined"
                        onChange={(e)=>handleUserChange(e)} />
                </div>
                <div className="mb-3">
                    <TextField
                        className="col-12"
                        error={error === "userForm" || error === "userFormEmail" ? true : false}
                        id="outlined-basic"
                        label={error === "userForm" || error === "userFormEmail" ? `${errorMessage} Email Id` : "Email Id"}
                        value={userData.email}
                        name = "email"
                        variant="outlined"
                        onChange={(e)=>handleUserChange(e)} />
                </div>
                <div className='d-grid gap-2 text-center mt-4'>
                    <button type="submit" className="btn btn-danger px-4 text-center" onClick={(e) => handleRegistrationUser(e,userData)}>
                        Register User
                    </button>
                </div>
            </form>

            </Collapse>
            <Collapse in={open} >
                <h2 className='text-danger text-center'>Teacher Registration</h2>

                <button type="button" className="btn btn-danger px-4 text-center mb-4" onClick={() => setOpen(false)}>
                        Go back
                </button>

                <form>
                   
                {/* {teacherData.error ?  
                    <div className="alert alert-danger py-2 " role="alert">
                        {teacherData.error}
                    </div>
                : ""} */}

                    <div className="mb-3">
                        <TextField
                            className="col-12"
                            error={teacherError === "teacherForm" ? true : false}
                            id="outlined-basic"
                            label={teacherError === "teacherForm" ? `${teacherErrorMessage} Course` : "Course"}
                            value={teacherData.course}
                            name = "course"
                            variant="outlined"
                            onChange={(e)=>handleTeacherChange(e)} />
                    </div>
                    <div className="mb-3">
                        <TextField
                            className="col-12"
                            error={teacherError === "teacherForm" ? true : false}
                            id="outlined-basic"
                            label={teacherError === "teacherForm" ? `${teacherErrorMessage} Semester` : "Semester"}
                            value={teacherData.semester}
                            name = "semester"
                            variant="outlined"
                            onChange={(e)=>handleTeacherChange(e)} />
                    </div>
                    <div className="mb-3">
                        <TextField
                            className="col-12"
                            error={teacherError === "teacherForm" ? true : false}
                            id="outlined-basic"
                            label={teacherError === "teacherForm" ? `${teacherErrorMessage} Subject` : "Subject"}
                            value={teacherData.subject}
                            name = "subject"
                            variant="outlined"
                            onChange={(e)=>handleTeacherChange(e)} />
                    </div>
                    <div className='d-grid gap-2 text-center mt-4'>
                        <button type="submit" className="btn btn-danger px-4 text-center" onClick={(e) => handleTeacherRegistration(e,teacherData)}>
                            Register Teacher
                        </button>
                    </div>  
                </form>

            </Collapse>
        </div>

        </ProtectAdminRoute>
    );
};

export default RegisterUsers;
