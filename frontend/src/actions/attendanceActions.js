import { ENDPOINT_URL } from "../constants/constant"

export const markAttendance = (data) => {
    return fetch(`${ENDPOINT_URL}/mark-attendance`, {
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

export const openAttendancePortal = (data) => {
    return fetch(`${ENDPOINT_URL}/open-attendance-portal`, {
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

export const getAttendanceById = (attendanceId) => {
    return fetch(`${ENDPOINT_URL}/get-attendance/${attendanceId}`, {
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
    return fetch(`${ENDPOINT_URL}/mark-attendance-teacher`, {
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

export const getActivePortalsForTeachers = (teacherId) => {

    const url = `${ENDPOINT_URL}/get-active-portal-teachers/${teacherId}`
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

export const getAllActivePortals = () => {
    const url = `${ENDPOINT_URL}/get-all-active-portals`
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

export const getFilteredAttendance = async (course, semester, startDate, endDate) => {
    const url = `${ENDPOINT_URL}/get-filtered-portal?course=${course}&semester=${semester}&startDate=${startDate}&endDate=${endDate}`
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        return await response.json()
    } catch (error) {
        console.error("Error fetching filtered attendance:", error);
    }
}

export const getFilteredAttendanceByTeacher = (teacherId, course, semester, startDate, endDate) => {

    const url = `${ENDPOINT_URL}/get-filtered-portal-teachers/${teacherId}?${course ? `course=${course}` : ""}${semester ? `&semester=${semester}` : ""}${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`
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

export const getActivePortalForStudents = ({ course, semester, subjectType, subject, batch }) => {
    const url = `${ENDPOINT_URL}/get-active-portal-students?course=${course}&subjectType=${subjectType}&semester=${semester}&subject=${subject}&batch=${batch}`
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

export const deletePortalById = (attendanceId) => {
    return fetch(`${ENDPOINT_URL}/delete-portal/${attendanceId}`, {
        method: "DELETE",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const closePortalById = (attendanceId) => {
    return fetch(`${ENDPOINT_URL}/close-portal/${attendanceId}`, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}
