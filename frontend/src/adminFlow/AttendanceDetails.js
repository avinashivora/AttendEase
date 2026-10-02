import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import AdminNavBar from "../compoents/AdminNavBar";
import {
  getActivePortalsAdmin,
  getAttendancesByDate,
} from "./../actions/adminActions";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deletePortalById,
  closePortalById,
} from "../actions/attendanceActions";
const AttendanceDetails = () => {
  const [attendances, setAttendances] = useState([]);
  const [date, setDate] = useState(new Date());

  const fetchActivePortals = async () => {
    const response = await getActivePortalsAdmin();
    setAttendances(response.activeAttendances);
  };

  const fetchAttendancesByDate = async () => {
    const response = await getAttendancesByDate(date);
    setAttendances(response.attendances);
  };

  return (
    <>
      <ProtectAdminRoute>
        <AdminNavBar />
        <br />
        Date :{" "}
        <input
          type="date"
          className="col-md-2"
          value={date.toISOString().slice(0, 10)} // Format for input value
          onChange={(event) => setDate(new Date(event.target.value))}
        />
        <br />
        <button onClick={fetchActivePortals}>Get Active Attendances</button>
        <button onClick={fetchAttendancesByDate}>Get Attendance By Date</button>
        {attendances.length !== 0 ? (
          <div className="">
            {attendances.map((a, i) => (
              <div
                key={i}
                className={`card bg-transparent border-2 p-2 my-3  ${
                  a.accepting ? "border-danger" : ""
                }`}
              >
                <div>
                  <div>
                    <span className="fw-bold">Course: </span>
                    {a.course}
                  </div>
                  <div>
                    <span className="fw-bold">Semester: </span>
                    {a.semester}
                  </div>
                  <div>
                    <span className="fw-bold">Subject: </span>
                    {a.subject}
                  </div>
                  <div>
                    <span className="fw-bold">Subject Type: </span>
                    {a.subjectType} (Batch: {a.batch})
                  </div>
                  <div>
                    <span className="fw-bold">Data: </span>
                    {a.createdAt.slice(0, 10)}
                  </div>
                  <div>
                    <span className="fw-bold">Timing: </span>
                    {a.startTime + "-" + a.endTime}
                  </div>
                  <div>
                    <span className="fw-bold">Status: </span>
                    {a.accepting ? "Open" : "Closed"}
                  </div>
                </div>
                <hr />
                <div className="d-flex flex-wrap justify-content-around align-items-center">
                  {a.accepting ? (
                    <div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const userResponse = window.confirm(
                            "Do you want to close the portal?"
                          );
                          if (userResponse) {
                            closePortalById(a._id);
                            fetchActivePortals();
                          }
                        }}
                      >
                        Close Portal
                      </button>
                      <span> </span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const userResponse = window.confirm(
                            "Do you want to delete the portal?"
                          );
                          if (userResponse) {
                            deletePortalById(a._id).then((res) => {
                              // console.log(res)
                              fetchActivePortals();
                            });
                          }
                        }}
                      >
                        Delete Portal
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No portals present</p>
        )}
      </ProtectAdminRoute>
    </>
  );
};

export default AttendanceDetails;
