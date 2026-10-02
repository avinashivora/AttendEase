import { ENDPOINT_URL } from "../constants/constant";
import { useAuthStore } from "../store/store";

// const getToken = () => useAuthStore.getState().token;

export const createTeacher = (data) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/create-teacher`, {
    method: "POST",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in creating teacher:", err));
};

export const getAllTeachers = () => {
  // const token = getToken();
  // console.log("1", token)
  return fetch(`${ENDPOINT_URL}/get-all-teachers`, {
    method: "GET",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in creating teacher:", err));
};

export const deleteTeacher = (userId) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/delete-teachers/${userId}`, {
    method: "DELETE",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in getting all of the teachers:", err));
};

export const updateTeacher = (userId, data) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/update-teacher/${userId}`, {
    method: "PUT",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in getting all of the teachers:", err));
};

export const getDefaulters = ({ course, semester, startDate, endDate }) => {
  // const token = getToken();
  return fetch(
    `${ENDPOINT_URL}/get-defaulter-by-course-sem?course=${course}&semester=${semester}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getDefaultersByFilters = ({
  course,
  semester,
  subject,
  subjectType,
  startDate,
  endDate,
}) => {
  // const token = getToken();
  return fetch(
    `${ENDPOINT_URL}/get-defaulter-by-course-sem-sub?course=${course}&semester=${semester}&subject=${subject}&subjectType=${subjectType}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getCummultiveAttendance = ({
  course,
  semester,
  startDate,
  endDate,
}) => {
  // const token = getToken();
  return fetch(
    `${ENDPOINT_URL}/get-cummulative-attendance?course=${course}&semester=${semester}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const addCourse = (data) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/create-course`, {
    method: "POST",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in creating teacher:", err));
};

export const changeTeacherPermission = (teacherId) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/change-teacher-permission/${teacherId}`, {
    method: "PATCH",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getActivePortalsAdmin = () => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/get-active-portals-admin`, {
    method: "GET",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getAttendancesByDate = (date) => {
  // const token = getToken();
  return fetch(`${ENDPOINT_URL}/get-attendances-by-date?date=${date}`, {
    method: "GET",
    headers: {
      // 'Authorization': `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};