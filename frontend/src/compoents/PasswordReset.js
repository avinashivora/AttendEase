import { useLocation, useNavigate } from "react-router-dom"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react"
import { useAuthStore } from "../store/store";
import { updatePassword } from "../actions/authActions";
const PasswordReset = () => {

    const user = useLocation().state

    const [passData, setPassData] = useState({
        prevPass: '',
        newPass: '',
        confirmPass: '',
        error: '',
        errorMessage: ''
    })

    const navigate = useNavigate();

    const setStateUser = useAuthStore(state => state.setUser)

    const { prevPass, newPass, confirmPass, error, errorMessage } = passData

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';
        let errorMessage = '';
    
        if (name === 'confirmPass' && value !== passData.newPass) {
            error = 'mismatch';
            errorMessage = 'Passwords do not match';
        }
        if (name === 'newPass' && value !== passData.confirmPass) {
            error = 'mismatch';
            errorMessage = 'Passwords do not match';
        }
    
        setPassData(prevData => ({ ...prevData, [name]: value, error, errorMessage }));
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleUpdatePassword = () => {
        updatePassword({email: user.email, prevPass, confirmPass}).then(res => {
            console.log("ogftdyrtfuygiuhiojpok[p", res)
            if (res.status) {
                handleLogout()
            } 
            if (res === undefined) {
                setPassData({...passData, error: 'ServerMessage', errorMessage: `Server down, Contact Dev Cell`})
            }
            if (!res.status) {
                setPassData({...passData, error: 'ServerMessage', errorMessage: `Old ${res.error}`})
            }
        }).catch(err => {
            console.log(err)
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
                <form>
                    <div className="mb-3">
                        <TextField
                            type={showPassword ? "text" : "password"}
                            label="Previous Password"
                            value={prevPass}
                            name="prevPass"
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
                            value={newPass}
                            name="newPass"
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
                </form>
                <div className='text-center text-danger'>
                    {error === 'mismatch' ? errorMessage : null}
                </div>
                <div className='text-center text-danger'>
                    {error === 'ServerMessage' ? errorMessage : null}
                </div>
                <div className='d-grid  text-center mt-4 '>
                    <button type="button" className={`btn btn-danger px-4 text-center btn-lg ${error === 'mismatch' ? 'disabled': null} `} onClick={() => handleUpdatePassword()}>
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset