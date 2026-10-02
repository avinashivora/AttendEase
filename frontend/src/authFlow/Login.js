import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../actions/authActions';
import { useAuthStore } from '../store/store';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PreventAuthFlow } from '../manageRoutes/ProtectRoutes';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [loginFailed, setLoginFailed] = useState(false);
    const [close, setClose] = useState(false)
    const setStateUser = useAuthStore(state => state.setUser)
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        error: "",
        errorMessage: ""
    })

    const [serverMessage, setServerMessage] = useState('')

    const {
        error,
        errorMessage
    } = userData;

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleUserChange = (e) => {
        setServerMessage("")
        setUserData(prevData => ({ ...prevData, error: '', errorMessage: '', [e.target.name]: e.target.value }))
    }

    const handleLogin = async () => {

        if (userData.email === "" || userData.password === "") {
            setUserData({ ...userData, error: 'loginForm', errorMessage: '* Required Field ' })
        }
        else {
            login({ email: userData.email, password: userData.password })
                .then((data) => {
                    if (data === undefined) {
                        return setServerMessage("Server Down, Contact Dev Cell")
                    }
                    if (data.status === false) {
                        return setServerMessage(data.message)
                    }

                    if (data.user && data.user?.role === 1) {
                        // navigate("/teacher-dashboard")
                        return setServerMessage(`Teachers and Students don't have access to web portal, use mobile app instead`)
                    }

                    else if (data.user && data.user?.role === 2) {
                        navigate("admin-dashboard")
                    }

                    else if (data.user && data.user?.role === 0) {
                        return setServerMessage(`Teachers and Students don't have access to web portal, use mobile app instead`)
                        // navigate("student-dashboard")
                    }
                    setStateUser(data.user)

                })
                .catch((error) => {
                    setLoginFailed(true)
                    setUserData({ ...userData, error: 'loginForm', errorMessage: ' Invalid Email Id or Password  ' })
                    console.error('Login error:', error.message);
                });
        }
    };

    const handleClose = () => {
        setClose(false)
        // navigate('/')

    }

    return (
        <PreventAuthFlow>

            <div className=''>
                <div className='py-3 text-center'>
                    <h3>Notices</h3>
                    <Link to="/minor-selection-form" className="mt-4 d-block text-center text-danger"><h3>Minor Selection form</h3></Link>
                    {/* <Link onClick={() => setClose(true)} className="mt-4 d-block text-center text-danger"><h3>Minor Selection form</h3></Link> */}

                </div>
            </div>
            <div className="container mt-5 col-md-6 col-11 shadow py-5 p-md-5">
                <h2 className='text-danger text-center '>ATTENDANCE LOGIN</h2>
                <form>
                    <div className="mb-3">
                        <TextField
                            className="col-12"
                            error={error === "loginForm" ? true : false}
                            id="outlined-basic"
                            type='email'
                            label={error === 'loginForm' ? `${errorMessage} ` : "Email Id"}
                            value={userData.email.toLowerCase()}
                            name="email"
                            variant="outlined"
                            onChange={(e) => handleUserChange(e)} />
                    </div>

                    <div className="mb-3">

                        <TextField
                            type={showPassword ? "text" : "password"}
                            label={error === 'loginForm' ? `${errorMessage} ` : "Password"}
                            error={error === "loginForm" ? true : false}
                            value={userData.password}
                            name="password"
                            onChange={(e) => handleUserChange(e)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                    </div>
                </form>
                <div className='text-center text-danger'>
                    {serverMessage === '' ? null : serverMessage}
                </div>
                <div className='d-grid  text-center mt-4 '>
                    <button type="button" className="btn btn-danger px-4 text-center btn-lg" onClick={() => handleLogin()}>
                        Login
                    </button>
                </div>
                {/* <div className='text-center my-3'>
                    The Web portal will be soon deactivated for the students. Attendance will be accepted only from Application
                </div> */}
                <div>
                    <Link to="/forgot-password" className="mt-4 d-block text-center text-danger">Forgot Password</Link>
                </div>

                <Dialog open={close} >
                    <DialogTitle className="text-danger text-center text-uppercase font-weight-bold">Portal Closed</DialogTitle>
                    <DialogContent className="text-center">
                        The portal for selecting minor subjects is now closed. Thank you for your participation!
                        <br />
                        If you have not filled out the form, please contact your teacher for further details.
                        <br />
                        Your teacher will assist you with the next steps.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose()}>OK</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </PreventAuthFlow>
    );
};

export default Login;
