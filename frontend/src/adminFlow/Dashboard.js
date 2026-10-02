import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import AdminNavBar from "../compoents/AdminNavBar";
import {
  changeTeacherPermission,
  getAllTeachers,
} from "../actions/adminActions";
import { useEffect, useState } from "react";
import { Collapse } from "@mui/material";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [teachersArray, setTeachersArray] = useState([]);
  const [openCollapse, setOpenCollapse] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleCollapseToggle = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };

  const [error, setError] = useState("");

  useEffect(() => {
    handleGetTeachers();
  }, [refresh]);

  const handleGetTeachers = () => {
    getAllTeachers().then((res) => {
      if (res === undefined) {
        setError("Server Down, Contact Dev Cell");
      } else {
        setTeachersArray(res.response);
      }
    });
  };

  const handleTeacherPermission = (teacherId) => {
    // console.log(teacherId)
    changeTeacherPermission(teacherId)
      .then((response) => {
        if (response.isActive) {
          setRefresh(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setRefresh(false);
  };

  return (
    <ProtectAdminRoute>
      <div>
        <AdminNavBar />
        <div className="container-fluid mt-5">
          <div>
            {error === "" ? null : (
              <div className="py-5 fs-4 text-center text-danger">{error}</div>
            )}
            <div className="container">
              <h2 className="fw-bold">Faculty Data</h2>
              <div className="">
                <div className="">
                  {teachersArray.map((t, i) => (
                    <div key={i} className="py-2">
                      <div
                        className={`card p-2 bg-transparent ${t?.teacherId?.isActive
                            ? `border-primary`
                            : `border-danger`
                          } border-2`}
                      >
                        <div>
                          <span className="fw-bold">Name: </span>
                          {t?.firstName} {t?.middleName} {t?.lastName}
                        </div>
                        <div>
                          <span className="fw-bold">Email: </span>
                          {t?.teacherId?.email}
                        </div>
                        <div
                          className={`${t?.teacherId?.isActive
                              ? `text-primary`
                              : `text-danger`
                            }`}
                        >
                          <span className="fw-bold text-dark">Status: </span>
                          {t?.teacherId?.isActive ? "Active" : "Not Active"}
                        </div>
                        <div>
                          <span className="fw-bold">Visiting Faculty: </span>
                          {t?.teacherId?.visitingFaculty ? "Yes" : "No"}
                        </div>
                        <hr />
                        <div>
                          <div className="d-flex flex-wrap justify-content-between">
                            <button
                              onClick={() => handleCollapseToggle(i)}
                              className="my-1 btn btn-sm btn-outline-primary"
                            >
                              View Subjects
                            </button>
                            <Link to={"update-teacher"} state={{ from: t }}>
                              <button
                                onClick={() => handleCollapseToggle(i)}
                                className="my-1 btn btn-sm btn-outline-warning"
                              >
                                Update
                              </button>
                            </Link>
                            {t?.teacherId?.isActive ? (
                              <button
                                onClick={() =>
                                  handleTeacherPermission(t?.teacherId?._id)
                                }
                                className="my-1 btn btn-danger btn-sm"
                              >
                                Deactivate Teacher
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleTeacherPermission(t?.teacherId?._id)
                                }
                                className="my-1 btn btn-danger btn-sm"
                              >
                                Activate Teacher
                              </button>
                            )}
                          </div>
                          <Collapse in={openCollapse === i}>
                            <div>
                              <div colSpan="4">
                                <ul>
                                  {t?.teacherId?.selectQuery.map((q, qi) => (
                                    <li key={qi}>
                                      Semester: {q.semester}, Course: {q.course}
                                      , Batch: {q.batch}, Subject: {q.subjects}{" "}
                                      ,SubjectType: {q.subjectType}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectAdminRoute>
  );
};

export default AdminDashboard;
