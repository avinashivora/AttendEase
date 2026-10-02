import { useNavigate } from "react-router-dom"
import { Collapse, IconButton, InputAdornment, TextField } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react"
import { requestOtp, resetPasswordByOtp, updatePassword } from "../actions/authActions";
import { useAuthStore } from "../store/store";
const ForgotPassword = () => {

    const [otpRequested, setOptRequested] = useState(false)

    const [passData, setPassData] = useState({
        email: '',
        otp: '',
        pass: '',
        confirmPass: '',
        error: '',
        errorMessage: ''
    })

    const navigate = useNavigate();

    const setStateUser = useAuthStore(state => state.setUser)

    const { email, otp, pass, confirmPass, error, errorMessage } = passData

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';
        let errorMessage = '';

        if (name === 'confirmPass' && value !== passData.pass) {
            error = 'mismatch';
            errorMessage = 'Passwords do not match';
        }
        if (name === 'pass' && value !== passData.confirmPass) {
            error = 'mismatch';
            errorMessage = 'Passwords do not match';
        }

        setPassData(prevData => ({ ...prevData, [name]: value, error, errorMessage }));
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleUserChange = (e) => {
        setPassData(prevData => ({ ...prevData, error: '', errorMessage: '', [e.target.name]: e.target.value }))
    }

    const handleGetOtp = () => {
        requestOtp({ email: email }).then(res => {
            if (res.success) {
                setOptRequested(true)
            } else {
                console.log(res)
                setPassData(prevData => ({ ...prevData, error: 'EMAIL_NOT_FOUND', errorMessage: res.message}))
            }
        })
    }

    const handlePassReset = () => {
        resetPasswordByOtp({ email: email, otp: otp, password: confirmPass }).then(res => {
            if (res.success) {
                console.log(res)
                handleLogout()
            } else {
                setPassData(prevData => ({ ...prevData, error: 'PASS_RESET_ERROR', errorMessage: res.message}))
            }
        })
    }

    const handleLogout = () => {
        setStateUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div>
            <div className="container mt-5 col-md-6 col-10 shadow p-5">
                <h2 className='text-danger text-center '>Reset Password</h2>
                <Collapse in={!otpRequested}>
                    <div>
                        <div className="mb-3">
                            <TextField
                                className="col-12"
                                error={error === "loginForm" ? true : false}
                                id="outlined-basic"
                                label={error === 'loginForm' ? `${errorMessage} ` : "Email Id"}
                                value={email}
                                name="email"
                                variant="outlined"
                                onChange={(e) => handleUserChange(e)} />
                        </div>
                        {error === 'EMAIL_NOT_FOUND' ? <div className="text-center text-danger">{errorMessage}</div> : null}
                        <button onClick={() => {
                            handleGetOtp()
                        }} className="btn btn-danger">
                            Send OTP
                        </button>
                    </div>
                </Collapse>
                <Collapse in={otpRequested}>
                    <div>
                        <div className="mb-3">
                            <TextField
                                type={showPassword ? "text" : "password"}
                                label="OTP"
                                value={otp}
                                name="otp"
                                onChange={(e) => handleChange(e)}
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
                        <div className="mb-3">
                            <TextField
                                type={showPassword ? "text" : "password"}
                                label="New Password"
                                value={pass}
                                name="pass"
                                onChange={(e) => handleChange(e)}
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

                        <div className="mb-3">
                            <TextField
                                type={showPassword ? "text" : "password"}
                                label="Conform New Password"
                                value={confirmPass}
                                name="confirmPass"
                                onChange={(e) => handleChange(e)}
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
                        <div className='text-center text-danger'>
                            {error === 'mismatch' ? errorMessage : null}
                        </div>
                        {error === 'PASS_RESET_ERROR' ? <div className="text-center text-danger">{errorMessage}</div> : null}
                        <div className='d-grid  text-center mt-4 '>
                            <button
                            onClick={() => {
                                handlePassReset()
                            }}
                            className={`btn btn-danger px-4 text-center btn-lg ${error === 'mismatch' ? 'disabled' : null} `} >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </Collapse>
                <div className='text-center text-danger'>
                    {error === 'ServerMessage' ? errorMessage : null}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword