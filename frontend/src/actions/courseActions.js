import { ENDPOINT_URL } from "../constants/constant";

export const getDistinctCourses = () => {
    return fetch(`${ENDPOINT_URL}/get-courses`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json())
        .catch(err => console.log(console.log(err)))
}

export const getAllCourses = () => {
    return fetch(`${ENDPOINT_URL}/get-all-courses`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json())
        .catch(err => console.log(console.log(err)))
    }
    
    export const getCourseData = (course) => {
        return fetch(`${ENDPOINT_URL}/get-course-data?course=${course}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .catch(err => console.log(console.log(err)))
}

export const updateCourse = (data) => {
    console.log(data)
    return fetch(`${ENDPOINT_URL}/update-course/${data.courseId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

    }).then((response) => {
        return response.json()
    }).catch(err =>
        console.log("Error in getting all of the teachers:", err)
    )
}
