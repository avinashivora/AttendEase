import { ProtectStudentRoute } from "../manageRoutes/ProtectRoutes"
import StudentNavBar from "../compoents/StudentNavBar"
import { useState, useEffect } from "react"
import { getActivePortalForStudents, markAttendance } from "./../actions/attendanceActions"
import { useAuthStore } from "../store/store"
import { Collapse } from "@mui/material"
import { useNavigate } from "react-router-dom"
const StudentDashBoard = () => {

    const navigate = useNavigate()
    const user = useAuthStore.getState().user

    useEffect(() => {
        if (!user || user.role !== 0) {
            navigate("/", { replace: true })
        }
    }, [])


    const subjects = user?.studentData?.subjects
    const subjectType = user?.studentData?.subjectType
    const batches = user?.studentData?.batch
    const [activeAttendance, setActiveAttendance] = useState(null)
    const [selectedClass, setSelectedClass] = useState(subjects ? { subject: subjects[0], batch: batches[0] } : null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [openPortalData, setOpenPortalData] = useState(false)
    const [showSubjectList, setShowSubjectList] = useState(false)

    const getActivePortal = () => {
        getActivePortalForStudents({ course: user.studentData.course, subjectType: user.studentData.subjectType, semester: user.studentData.semester, ...selectedClass }).then(res => {
            if (res === undefined) {
                setErrorMsg('Server Down, Contact Dev Cell')
            }
            if (res.success) {
                setErrorMsg("")
                setActiveAttendance(res.attendance)
            } else {
                setErrorMsg(res.message)
            }
        })
    }

    const markStudentAttendance = () => {
        markAttendance({ attendanceId: activeAttendance._id, course: user.studentData.course, semester: user.studentData.semester, ...selectedClass, seatNumber: user.studentData.seatNumber }).then(res => {
            console.log(res)
            setOpenPortalData(true)
            if (res.success) {
                setShowSuccess(true)
                setShowError(false)
            } else {
                setShowSuccess(false)
                setShowError(true)
            }
        })
    }
    const elements = subjects ? subjects.map((el, i) => (
        <option key={i} value={JSON.stringify({ subject: el, subjectType: subjectType[i], batch: batches[i] })}>{`${el} subjectType: ${subjectType[i]} batch : ${batches[i]}`}</option>
    )) : null


    const activeAttendanceElement = activeAttendance ? (
        <Collapse in={!openPortalData}>
            <div className="d-md-none d-block">
                <div className={`card border-primary rounded-lg my-2 p-2`}>
                    <div className="">
                        <div>
                            <span className="fw-bold">Course: </span>{activeAttendance?.course} (Sem: {activeAttendance?.semester})
                        </div>
                        <div className="">
                            <span className="fw-bold">Subject: </span>{activeAttendance?.subject}
                        </div>
                        <div>
                            <span className="fw-bold">Batch: </span>{activeAttendance?.batch}
                        </div>
                        <div>
                            <button className="btn col-12 btn-danger" onClick={markStudentAttendance}>Mark present</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-responsive d-none d-md-block">
                <table className="table text-center ">
                    <thead>
                        <tr>
                            <th scope="col">Course</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Batch</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{activeAttendance.course}</td>
                            <td>{activeAttendance.semester}</td>
                            <td>{activeAttendance.subject}</td>
                            <td>{activeAttendance.batch}</td>
                            <td><button className="btn btn-danger" onClick={markStudentAttendance}>Mark present</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Collapse>
    ) : ""


    return (
        <ProtectStudentRoute>
            <div>
                <StudentNavBar />
                <div className="container-fluid d-flex flex-wrap justify-content-center align-items-center">
                    <div className="col-md-8 col-12 py-5">
                        <div>
                            <div className="mb-3">
                                <label htmlFor="class" className="form-label">Class:</label>
                                {/* <select className="form-select" id="class" aria-label="Default select example"
                                    onChange={(e) => setSelectedClass(JSON.parse(e.target.value))} >
                                    <option disabled defaultChecked defaultValue=''>Select</option>
                                    {elements}
                                </select> */}

                                <Collapse in={!showSubjectList}>
                                    <button className="btn btn-danger col-12 py-2" onClick={() => {setShowSubjectList(true)
                                    setActiveAttendance(null)}}>
                                        Show Classes
                                    </button>
                                </Collapse>
                                <div className="py-3">
                                    <div>
                                        <div><span className="fw-bold">Subject:</span> {selectedClass?.subject}({selectedClass?.subjectType}) (Batch: {selectedClass?.batch})</div>
                                    </div>
                                </div>
                                <Collapse in={showSubjectList}>
                                    <button onClick={() => setShowSubjectList(false)} className="btn btn-sm btn-danger">
                                        Close
                                    </button>
                                    {subjects ? subjects.map((el, i) => (
                                        <button className="btn btn-outline-danger fw-bold text-start col-12 my-2 py-2" onClick={() => {
                                            setSelectedClass({ subject: el, subjectType: subjectType[i], batch: batches[i] })
                                            setShowSubjectList(false)
                                        }} key={i} >
                                            {`${el} subjectType: ${subjectType[i]} batch : ${batches[i]}`}
                                        </button>
                                    )) : null}
                                </Collapse>
                                <button className="btn btn-danger col-12 my-3" onClick={getActivePortal}>Get Portal</button>
                            </div>
                            {activeAttendance ? activeAttendanceElement : ""}
                            <Collapse in={openPortalData}>
                                {showSuccess ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        <strong>Attendance Marked</strong>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>

                                    : ""}
                                {showError ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>Portal is Closed</strong>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                    : ""}
                            </Collapse>
                        </div>
                        <div className="text-center text-danger " >{errorMsg}</div>
                    </div>
                </div>
            </div>
        </ProtectStudentRoute>
    )
}

export default StudentDashBoard