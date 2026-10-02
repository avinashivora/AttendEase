import { useEffect, useState } from "react";
import AdminNavBar from "../compoents/AdminNavBar"
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes"
import { useAuthStore } from "../store/store";
import { closePortalById, deletePortalById, getAllActivePortals, getFilteredAttendance } from "../actions/attendanceActions";
import { Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { getAllCourses, getDistinctCourses } from "../actions/courseActions";
import { getActivePortalsAdmin } from "./../actions/adminActions";

const ActivePortals = () => {
    const now = new Date();
    const user = useAuthStore.getState().user
    const [uniqueCourses, setUniqueCourses] = useState([]);
    const [uniqueSemesters, setUniqueSemesters] = useState([]) //Initial value
    const [courses, setCourses] = useState("");
    const [startDate, setStartDate] = useState(new Date()); // Initial value
    const [endDate, setEndDate] = useState(new Date()); // Initial value
    const [errorMessage, setErrorMessage] = useState("")
    const [showError, setShowError] = useState(false)
    const [attendanceData, setAttendanceData] = useState([])
    const [filteredAttendance, setFilteredAttendance] = useState([])
    const [filterSemesterDropdown, setFilterSemesterDropdown] = useState(-1)
    const [filterCourseDropdown, setFilterCourseDropdown] = useState(-1)
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [showFilteredData, setShowFilteredData] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getAllCourses();
            setCourses(res.courses);
        }
        fetchCourses();
    }, []);

    useEffect(() => {
        getAllActivePortals().then(res => {
            if (res !== undefined) {
                setAttendanceData(res.activePortals.reverse())
                setShowFilteredData(false)
                setFilteredAttendance([])
            } else {
                setShowError(true)
                setErrorMessage("Server Down, Contact Dev Cell")
            }
        })
    }, [refresh]);

    const filterAttendance = async () => {
        const res = await getFilteredAttendance(filterCourseDropdown, filterSemesterDropdown, startDate, endDate)
        if (res.success === false) {
            if (res.err.name === "CastError") {
                setShowError(true)
                setErrorMessage(`Invalid ${res.err.path}: ${res.err.value}. Please provide a valid ${res.err.path}.`)
            } else {
                console.log("Response: ", res)
            }
            return
        }
        setFilteredAttendance(res.portal.reverse())
        setShowFilteredData(true)
    }

    const handleCourseChange = (event) => {
        const courseName = event.target.value;
        setFilterCourseDropdown(courseName);

        const semestersForSelectedCourse = [
            ...new Set(
                courses
                    .filter((el) => el.courseName === courseName)
                    .map((el) => el.semester)
            ),
        ];

        // If the course is found, set uniqueSemesters to the semesters of the selected course
        if (semestersForSelectedCourse) {
            setUniqueSemesters(semestersForSelectedCourse); // Assuming course.semesters is an array of semesters
        }
        setFilterSemesterDropdown(-1)
    };

    const fetchCourseNames = async () => {
        setShowFilterForm((prev) => !prev)
        const res = await getDistinctCourses();
        setUniqueCourses(res.data);

        const semestersForSelectedCourse = [
            ...new Set(
                courses
                    ?.filter((el) => el.courseName === res.data[0])
                    .map((el) => el.semester)
            ),
        ];

        if (semestersForSelectedCourse) {
            setUniqueSemesters(semestersForSelectedCourse);
        }
    };

    const fetchActivePortals = async () => {
        const response = await getActivePortalsAdmin();
        setShowFilteredData(true)
        setFilteredAttendance(response.activeAttendances);
      };

    const handleSemesterChange = (e) => {
        setFilterSemesterDropdown(e.target.value);
    }
    return (
        <ProtectAdminRoute>
            <AdminNavBar />
            <div className="container-fluid">
                {showError && <div className="alert alert-danger d-flex justify-content-between" role="alert">
                    <span>{errorMessage}</span>
                    <button className="btn-close" aria-label="Close" onClick={() => setShowError((prevData) => !prevData)}></button>
                </div>}
                <Collapse in={!showFilteredData}>
                    <div className="p-2">
                        <h4 className="fw-bold">Attendance Portals</h4>
                        <div className="p-2" style={{ height: '100%' }}>
                            <button className="btn btn-danger" onClick={fetchCourseNames}>
                                {showFilterForm ? 'Close Form' : 'Show Filteration Form'}
                            </button>
                            <button className="btn btn-danger" style={{marginLeft:"2vw"}} onClick={fetchActivePortals}>Get Active Attendances</button>
                            <Collapse in={showFilterForm}>
                                <div>
                                    <label htmlFor="endTime" className="form-label">Course:</label>
                                    <select className="form-select" aria-label="Default select example" value={filterCourseDropdown} onChange={handleCourseChange}>
                                        <option key={-1} value={-1}>Select an Course</option>
                                        {uniqueCourses.map((el, i) => <option key={i} value={el}>{el}</option>)}
                                    </select>
                                    <label htmlFor="endTime" className="form-label">Semester:</label>
                                    <select className="form-select" aria-label="Default select example" value={filterSemesterDropdown} onChange={handleSemesterChange}>
                                        <option key={-1} value={-1}>Select an Semester</option>
                                        {uniqueSemesters.map((el, i) => <option key={i} value={el}>{el}</option>)}
                                    </select>
                                    <div className="d-flex flex-wrap justify-content-around align-items-between">
                                        <div className="d-flex flex-wrap">
                                            <label htmlFor="endTime" className="p-2 form-label">Start Date:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={startDate.toISOString().slice(0, 10)} // Format for input value
                                                onChange={(event) => setStartDate(new Date(event.target.value))}
                                            />
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            <label htmlFor="endTime" className="p-2 form-label">End Date:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={endDate.toISOString().slice(0, 10)} // Format for input value
                                                onChange={(event) => setEndDate(new Date(event.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-sm btn-warning col-md-3 my-3" onClick={filterAttendance}>Filter</button>
                                    <button className="btn btn-sm btn-danger col-md-3 my-3" onClick={() => {
                                        setRefresh(prevState => !prevState)
                                        setShowFilterForm(prevState => !prevState)
                                    }}>Refresh</button>
                                </div>
                                <br />
                                <div className="alert alert-warning d-flex justify-content-between" role="alert">
                                    <span>To retrieve attendance records from the 1st to the 10th, please set the start date to the 1st and the end date to the 11th. The end date should be one day after the desired range to include the 10th.</span>
                                </div>
                            </Collapse>



                            {attendanceData.length !== 0 ?
                                <div className="row">
                                    {attendanceData.map((a, i) => (
                                        <div key={i} className={`card bg-transparent col-5 border-2 p-2 my-3 m-4 ${a.accepting ? "border-danger" : "border-primary"}`}>
                                            <div>
                                                <div>
                                                    <span className="fw-bold">Course: </span>{a.course}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Semester: </span>{a.semester}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Subject: </span>{a.subject}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Subject Type: </span>{a.subjectType} (Batch: {a.batch})
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Date: </span>{a.createdAt.slice(0, 10)}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Timing: </span>{a.startTime + "-" + a.endTime}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Status: </span>{a.accepting ? "Open" : "Closed"}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                                : <p>No Portal Available</p>
                            }
                        </div>
                    </div>
                </Collapse>
                <Collapse in={showFilteredData}>
                    <div className="" style={{ height: '100%' }}>
                        <button className="btn btn-sm btn-warning col-md-6 col-10 my-3" onClick={() => setShowFilteredData(false)}>Remove Filters</button>
                        {filteredAttendance.length !== 0 ?
                            <div className="row">
                                {filteredAttendance.map((a, i) => (
                                    <div key={i} className={`card bg-transparent col-5 border-2 p-2 my-3 m-4 ${a.accepting ? "border-danger" : "border-primary"}`}>
                                        <div>
                                            <div>
                                                <span className="fw-bold">Course: </span>{a.course}
                                            </div>
                                            <div>
                                                <span className="fw-bold">Semester: </span>{a.semester}
                                            </div>
                                            <div>
                                                <span className="fw-bold">Subject: </span>{a.subject}
                                            </div>
                                            <div>
                                                <span className="fw-bold">Subject Type: </span>{a.subjectType} (Batch: {a.batch})
                                            </div>
                                            <div>
                                                <span className="fw-bold">Date: </span>{a.createdAt.slice(0, 10)}
                                            </div>
                                            <div>
                                                <span className="fw-bold">Timing: </span>{a.startTime + "-" + a.endTime}
                                            </div>
                                            <div>
                                                <span className="fw-bold">Status: </span>{a.accepting ? "Open" : "Closed"}
                                            </div>
                                        </div>
                                        {a.accepting && <hr />}
                                        <div className="d-flex flex-wrap justify-content-around align-items-center">
                                            {/*<Link to="/admin-dashboard/active-portals/attendance" className="col-md" state={{ attendanceId: a._id }}>
                                                <button disabled="true" className="btn btn-primary btn-sm">View</button>
                                            </Link>*/}

                                            {a.accepting ?
                                                <div>
                                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                                        const userResponse = window.confirm("Do you want to close the portal?")
                                                        if (userResponse) {
                                                            closePortalById(a._id)
                                                            setRefresh(prevState => !prevState)
                                                        }
                                                    }}>
                                                        Close Portal
                                                    </button>
                                                    <span> </span>
                                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                                        const userResponse = window.confirm("Do you want to delete the portal?")
                                                        if (userResponse) {
                                                            deletePortalById(a._id).then(res => {
                                                                setRefresh(prevState => !prevState)
                                                            })
                                                        }
                                                    }}>
                                                        Delete Portal
                                                    </button>
                                                </div>
                                                : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            : <p>No Portal Available</p>}
                    </div>
                </Collapse>
            </div>
        </ProtectAdminRoute>
    )
}

export default ActivePortals