import { ProtectTeacherRoute } from "../manageRoutes/ProtectRoutes";
import React, { useState, useEffect } from "react"
import { useAuthStore } from "../store/store";
import { openAttendancePortal, getActivePortalsForTeachers, deletePortalById, closePortalById, getFilteredAttendanceByTeacher } from "../actions/attendanceActions";
import TeacherNavBar from "../compoents/TeacherNavBar";
import { Link } from "react-router-dom";
import { Collapse } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

const Attendance = () => {

    // const [teachersData, setTeachersData] = useState(user.teacherData)
    const now = new Date();
    const user = useAuthStore.getState().user
    const uniqueCourses = [...new Set(user?.teacherData?.selectQuery?.map(el => el.course))]
    const uniqueSemesters = [...new Set(user?.teacherData?.selectQuery?.map(el => el.semester))]
    const [startDate, setStartDate] = useState(new Date()); // Initial value
    const [endDate, setEndDate] = useState(new Date()); // Initial value
    const [dropdownData, setDropdownData] = useState()
    const [startTime, setStartTime] = useState(null)
    // const [endTime, setEndTime] = useState(null)
    const [portalTime, setPortalTime] = useState(10)
    const [noOfLectures, setNoOfLectures] = useState(1)
    const [showError, setShowError] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [attendanceData, setAttendanceData] = useState([])
    const [filteredAttendance, setFilteredAttendance] = useState([])
    const [filterSemesterDropdown, setFilterSemesterDropdown] = useState(uniqueSemesters[0])
    const [filterCourseDropdown, setFilterCourseDropdown] = useState(uniqueCourses[0])
    const [showSubjectList, setShowSubjectList] = useState(false)
    const [showFilterForm, setShowFilterForm] = useState(false)
    // const hoursArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    const portalTimeArray = [0.2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

    const currentHour = String(now.getHours()).padStart(2, '0'); // Ensure two digits, padding with '0' if needed
    const currentMinute = String(now.getMinutes()).padStart(2, '0'); // Ensure two digits, padding with '0' if needed

    // Set the default time to the current hour and minute as a string
    const [time, setTime] = useState(`${currentHour}:${currentMinute}`);

    const [showFilteredData, setShowFilteredData] = useState(false)
    useEffect(() => {
        getActivePortalsForTeachers(user?.teacherData?._id).then(res => {
            // console.log(res === undefined)
            if (res !== undefined) {
                setAttendanceData(res.activePortals.reverse())
                setShowFilteredData(false)
                setFilteredAttendance([])
            } else {
                setShowError(true)
                setErrorMessage("Server Down, Contact Dev Cell")
            }
            // console.log(res)
        })
    }, [refresh])

    const handleDropdownData = (e) => {
        if (e.target.value === "Select Here") {
            setDropdownData(e.target.value)
        } else {
            setDropdownData(JSON.parse(e.target.value))
        }
    }

    const openPortal = () => {
        if (!startTime || dropdownData === "Select Here" || !dropdownData) {
            setErrorMessage("Select Class details")
            setShowError(true)
        }
        // else if (!checkTimeDifference(startTime, endTime)) {
        //     setErrorMessage("Lecture should be of minimum 1 hour")
        //     setShowError(true)
        // }
        else {
            setShowError(false)

            openAttendancePortal({
                teacherId: user.teacherData?._id,
                course: dropdownData.course,
                semester: dropdownData.semester,
                subject: dropdownData.subject,
                subjectType: dropdownData.subjectType,
                batch: dropdownData.batch,
                startTime: parseInt(startTime),
                endTime: parseInt(startTime) + noOfLectures * 100,
                noOfLectures: noOfLectures,
                portalTime: portalTime,
                date: new Date()
            })
                .then(res => {
                    if (res.success) {
                        setRefresh(prevState => !prevState)
                        setShowError(false)

                    } else {
                        setShowError(true)
                        setErrorMessage(res.message)
                    }
                    // console.log(res)
                })
                .catch(err => console.log(err))
        }

    }

    //Elements
    //    const dropDownArrayElements = user.teacherData?.selectQuery.map((c, i) => (
    //      <option key={i} value={JSON.stringify(c)}>{`${c.subject}(${c.subjectType}), Batch:${c.batch}, ${c.course}, Semester: ${c.semester}`}</option>
    //))

    // const startTimeElement = hoursArray.map((hour, i) => {
    //     return <option key={i} value={`${hour}`}>{hour}</option>
    // })

    // const endTimeElement = hoursArray.map((hour, i) => {
    //     return <option key={i} value={`${hour}`}>{hour}</option>
    // })

    const portalTimeElements = portalTimeArray.map((time, i) => {
        return <option key={i} value={time}>{time}</option>
    })



    //methods
    const filterAttendance = () => {
        getFilteredAttendanceByTeacher(user.teacherData._id, filterCourseDropdown, filterSemesterDropdown, startDate, endDate).then(res => {
            setFilteredAttendance(res.portal.reverse())
            setShowFilteredData(true)
            // console.log(res)
        })
    }

    const closePortal = () => {

    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    // const IST = dayjs().tz('Asia/Kolkata');

    const handleTimeChange = (type, newTime) => {
        const formattedTime = dayjs(newTime)?.tz('Asia/Kolkata')?.format('HHmm');

        if (type === 'startTime') {
            setStartTime(formattedTime);
        }
        // else if (type === 'endTime') {
        //     setEndTime(formattedTime);
        // }
    };

    return (
        <ProtectTeacherRoute>
            <TeacherNavBar />
            <div className="d-flex flex-wrap justify-content-center align-items-start py-5 p-3" >
                <div className="container-fluid col-md-5 col-12 p-3 sticky-md-top">
                    {showError ?
                        <div className="alert alert-danger" role="alert" >
                            {errorMessage}
                        </div>
                        : ""
                    }
                    <div className="mb-3">
                        <div className="py-2">
                            <Collapse in={!showSubjectList}>
                                <button className="btn btn-danger col-12 py-2" onClick={() => setShowSubjectList(true)}>
                                    Show Classes
                                </button>
                            </Collapse>
                            <div className="py-3">
                                <div>
                                    <div><span className="fw-bold">Subject:</span> {dropdownData?.subject}({dropdownData?.subjectType}) (Batch: {dropdownData?.batch})</div>
                                </div>
                                <div>
                                    <div><span className="fw-bold">Course: </span>{dropdownData?.course} (Sem: {dropdownData?.semester})</div>
                                </div>
                            </div>
                            <Collapse in={showSubjectList}>
                                {user?.teacherData?.selectQuery.map((c, i) => (
                                    <button className="btn btn-danger fw-bold text-start col-12 my-2 py-2"
                                        onClick={() => {
                                            setDropdownData(c)
                                            setShowSubjectList(false)
                                            setShowError(false)
                                        }}
                                        key={i}>
                                        {`${c.subject}(${c.subjectType}), Batch:${c.batch}, ${c.course}, Semester: ${c.semester}`}
                                    </button>
                                ))}
                            </Collapse>
                        </div>
                        <div className="col-12 py-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopTimePicker
                                    ampm={false}
                                    onChange={(newTime) => handleTimeChange('startTime', newTime)}
                                    label="Portal Start Time (24hrs)" />
                                {/* <MobileTimePicker
                                    ampm={false}
                                    className="col-12"
                                    // value={} // Convert to Date for component
                                    label="Start Time"
                                    onChange={(newTime) => handleTimeChange('startTime', newTime)}
                                /> */}
                            </LocalizationProvider>
                        </div>
                        <div>
                            <label>No of Lecture</label>
                            <select className="form-select" aria-label="Default select example" value={noOfLectures} onChange={(e) => setNoOfLectures(e.target.value)}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                        </div>
                        <label>Portal Duration (in minutes)</label>
                        <select className="form-select" aria-label="Default select example" value={portalTime} onChange={(e) => setPortalTime(e.target.value)}>
                            {portalTimeElements}
                        </select>
                    </div>
                    <button className="btn btn-danger col-12 my-3" onClick={openPortal}>
                        Open Portal
                    </button>
                </div>
                <div className="col-md-6 col-12">
                    <Collapse in={!showFilteredData}>
                        <div className="p-2">
                            {attendanceData.length !== 0 ?
                                (
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        {/* <button className="btn btn-sm btn-warning col-md-3 col-10 my-3" onClick={() => setRefresh(prevState => !prevState)}>Refresh</button> */}
                                        <h4 className="text-danger px-2">Portals</h4>
                                    </div>)
                                : null}
                            <div className="p-2" style={{ height: '100%', overflow: "scroll" }}>
                                <button className="btn btn-danger" onClick={() => setShowFilterForm((prev) => !prev)}>
                                    {showFilterForm ? 'Close Form' : 'Show Filteration Form'}
                                </button>
                                <Collapse in={showFilterForm}>
                                    <div>
                                        <label htmlFor="endTime" className="form-label">Course:</label>
                                        <select className="form-select" aria-label="Default select example" value={filterCourseDropdown} onChange={(e) => setFilterCourseDropdown(e.target.value)}>
                                            {uniqueCourses.map((el, i) => <option key={i} value={el}>{el}</option>)}
                                        </select>
                                        <label htmlFor="endTime" className="form-label">Semester:</label>
                                        <select className="form-select" aria-label="Default select example" value={filterSemesterDropdown} onChange={(e) => setFilterSemesterDropdown(e.target.value)}>
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
                                    <button className="btn btn-sm btn-warning col-md-3 col-12 my-3" onClick={filterAttendance}>Filter</button>
                                    <br /><span>eg. if you want attendance from 1-10 , start date should be 1 and end date should be 11</span>
                                </Collapse>
                                {attendanceData.length !== 0 ?
                                    <div className="">
                                        {attendanceData.map((a, i) => (
                                            <div key={i} className={`card bg-transparent border-2 p-2 my-3  ${a.accepting ? "border-danger" : ""}`}>
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
                                                        <span className="fw-bold">Data: </span>{a.createdAt.slice(0, 10)}
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold">Timing: </span>{a.startTime + "-" + a.endTime}
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold">Status: </span>{a.accepting ? "Open" : "Closed"}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex flex-wrap justify-content-around align-items-center">
                                                    <Link to="/teacher-dashboard/attendance" className="col-md" state={{ attendanceId: a._id }}>
                                                        <button className="btn btn-primary btn-sm">View</button>
                                                    </Link>
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
                                                                        // console.log(res)
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

                                    : <p>No active portals present</p>
                                }
                            </div>
                        </div>
                    </Collapse>
                    <Collapse in={showFilteredData}>
                        <div className="" style={{ height: '100%', overflow: "scroll" }}>
                            <button className="btn btn-sm btn-warning col-md-6 col-10 my-3" onClick={() => setShowFilteredData(false)}>Remove Filters</button>
                            {filteredAttendance.length !== 0 ?
                                <div className="">
                                    {filteredAttendance.map((a, i) => (
                                        <div key={i} className={`card bg-transparent border-2 p-2 my-3  ${a.accepting ? "border-danger" : ""}`}>
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
                                                    <span className="fw-bold">Data: </span>{a.createdAt.slice(0, 10)}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Timing: </span>{a.startTime + "-" + a.endTime}
                                                </div>
                                                <div>
                                                    <span className="fw-bold">Status: </span>{a.accepting ? "Open" : "Closed"}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="d-flex flex-wrap justify-content-around align-items-center">
                                                <Link to="/teacher-dashboard/attendance" className="col-md" state={{ attendanceId: a._id }}>
                                                    <button className="btn btn-primary btn-sm">View</button>
                                                </Link>

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
                                                                    // console.log(res)
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
                                : <p>No active portals present</p>}
                        </div>
                    </Collapse>
                </div>
            </div >
        </ProtectTeacherRoute >
    )
}

export default Attendance
