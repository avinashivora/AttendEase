import { ENDPOINT_URL } from "../constants/constant";

export const getAllPrograms = () => {
  return fetch(`${ENDPOINT_URL}/getAllPrograms`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error getting resource:", err));
};

export const getAllMinorByProgram = (progName) => {
  return fetch(`${ENDPOINT_URL}/getAllMinorByProgram/${progName}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  }) //.then((response) => { return response })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error getting minors for this program:", err));
};

export const getAllMinors = () => {
  return fetch(`${ENDPOINT_URL}/getMinor`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error getting resource:", err));
};

export const getOneMinor = (courseName) => {
  return fetch(`${ENDPOINT_URL}/getOneMinor/${courseName}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error getting resource:", err));
};

export const createStudent = (studentData) => {
  return fetch(`${ENDPOINT_URL}/createStudent`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: studentData,
  })
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      // console.log(response.json())
      return response.json();
    })
    .catch((error) => {
      console.error("Error adding student:", error);
      throw error;
    });
};

export const getAllLanguages = () => {
  return fetch(`${ENDPOINT_URL}/getAllLanguages`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Error getting Languages", err));
};

export const getAllProfessionalCourses = () => {
  return fetch(`${ENDPOINT_URL}/getAllProfessionalCourses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Error getting prof courses", err);
      throw err; // Rethrow the error to propagate it
    });
};

export const getAllStudentsByCategories = (category, selectedCourse) => {
  return fetch(
    `${ENDPOINT_URL}/getAllStudentsByCategories?${category}=${selectedCourse}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Error getting Data ", err);
      throw err;
    });
};

export const getStudentByEmail = (email) => {
  return fetch(`${ENDPOINT_URL}/getStudentByEmail/${email}`, {
    // Use URL parameter
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      return response.json();
    })
    .catch((err) => {
      console.log("Error getting data", err);
      throw err;
    });
};

export const updateStudentByEmail = (email, updatedData) => {
  return fetch(`${ENDPOINT_URL}/updateStudentByEmail`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, updatedData }),
  })
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      return response.json();
    })
    .catch((err) => console.log("Error updating data", err));
};

export const updateStudentMemberIdByEmail = (email, updatedData) => {
  console.log("updated data", updatedData);
  console.log("email", email);
  return fetch(`${ENDPOINT_URL}/updateStudentMemberIdByEmail`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, updatedData }),
  })
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      return response.json();
    })
    .catch((err) => console.log("Error updating data", err));
};

export const deleteStudentByEmail = (email) => {
  return fetch(`${ENDPOINT_URL}/deleteStudentByEmail/${email}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Student with email ${email} deleted successfully`, data);
      return data;
    })
    .catch((err) => {
      console.error("Error deleting student:", err);
      throw err;
    });
};
