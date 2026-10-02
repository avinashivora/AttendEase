import { ENDPOINT_URL } from "../constants/constant";

export const getSingleTeacher = (teacherEmail) => {
  return fetch(`${ENDPOINT_URL}/get-single-teacher?email=${teacherEmail}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(console.log(err)));
};

export const sendClassData = (classData) => {
  return fetch(`${ENDPOINT_URL}/open-attendance-portal`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(classData),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error in creating student:", err));
};

export const updateTeacherByTeacher = (userId, data) => {
  console.log(userId, data);
  return fetch(`${ENDPOINT_URL}/update-teacher-by-teacher/${userId}`, {
    method: "PUT",
    headers: {
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
