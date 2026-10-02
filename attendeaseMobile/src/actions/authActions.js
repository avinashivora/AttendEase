export const login = (data) => {
    return fetch(`http://192.168.29.232:7000/api_v1/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            return data
        })
        .catch((error) => console.error('Login error:', error));
};

export const getStudentAttendance = (email) =>{
    return fetch(`http://192.168.29.232:7000/api_v1/get-student-attendance`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email})
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const getActivePortalForStudents = ({ course, semester, subjectType, subject, batch }) => {
    const url = `http://192.168.29.232:7000/api_v1/get-active-portal-students?course=${course}&subjectType=${subjectType}&semester=${semester}&subject=${subject}&batch=${batch}`
    return fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const markAttendance = (data) => {
    return fetch(`http://192.168.29.232:7000/api_v1/mark-attendance`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const getActivePortalsForTeachers = (teacherId) => {

    const url = `http://192.168.29.232:7000/api_v1/get-active-portal-teachers/${teacherId}`
    return fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const openAttendancePortal = (data) => {
    return fetch(`http://192.168.29.232:7000/api_v1/open-attendance-portal`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const closePortalById = (attendanceId) => {
    return fetch(`http://192.168.29.232:7000/api_v1/close-portal/${attendanceId}`, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}


export const deletePortalById = (attendanceId) => {
    return fetch(`http://192.168.29.232:7000/api_v1/delete-portal/${attendanceId}`, {
        method: "DELETE",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const getAttendanceById = (attendanceId) => {
    return fetch(`http://192.168.29.232:7000/api_v1/get-attendance/${attendanceId}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const markAttendanceByTeacher = (attendanceId, seatNumber, present) => {
    return fetch(`http://192.168.29.232:7000/api_v1/mark-attendance-teacher`, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ attendanceId, seatNumber, present })
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const updatePassword = (data) => {
    return fetch(`http://192.168.29.232:7000/api_v1/update-password/${data.email}`, {
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

export const getLatestPatch = () => {
    return fetch(`https://attendease-sksc.somaiya.edu/api_v1/get-latest-patch`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
    .then((res) => {
        return res.json();
    })
    .catch((err) => console.log("Error getting patch note:", err));
}