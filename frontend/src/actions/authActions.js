// import { useAuthStore } from "../store/store";
import { ENDPOINT_URL } from "../constants/constant";
// const getToken = () => useAuthStore.getState().token;

export const login = (data) => {
    return fetch(`${ENDPOINT_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Save token and user info to localStorage
            if (data.status && data.user.role === 2) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // useAuthStore.setUser(data.user)
                // console.log(useAuthStore)

                // Set a timer to remove token and user info after 3 hours (in milliseconds)
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }, 3 * 60 * 60 * 1000); // 3 hours
            }
            return data
        })
        .catch((error) => console.error('Login error:', error));
};

export const register = (data) => {
    console.log(data)
    return fetch(`${ENDPOINT_URL}/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {

        return response

    }).catch(err => {
        console.log(err)
    })

}

export const updatePassword = (data) => {
    return fetch(`${ENDPOINT_URL}/update-password/${data.email}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))
}

export const serverLive = () => {
    return fetch(`${ENDPOINT_URL}/server-live`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }).then(res => {
        return res.json()
    }).catch(err => {
        console.log(err)
        // return err.json()
    })
}

export const requestOtp = (data) => {
    return fetch(`${ENDPOINT_URL}/generate-otp-for-password`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json()
    }).then(response => {
        return response
    }).catch(err => {
        console.log(err)
    })
}

export const resetPasswordByOtp = (data) => {
    return fetch(`${ENDPOINT_URL}/reset-password-by-otp`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json()
    }).then(response => {
        return response
    }).catch(err => {
        console.log(err)
    })
}