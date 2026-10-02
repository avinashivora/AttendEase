import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getAttendanceById } from "./../actions/attendanceActions"
import { markAttendanceByTeacher } from "./../actions/attendanceActions"
import TeacherNavBar from "../compoents/TeacherNavBar";
import { ProtectTeacherRoute } from "../manageRoutes/ProtectRoutes";
import moment from 'moment-timezone';
import jsPDF from "jspdf";
import { Collapse } from "@mui/material"
import TextField from '@mui/material/TextField'

const Attendance = () => {
    const { state } = useLocation()
    const [attendanceData, setAttendanceData] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [present, setPresent] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getAttendanceById(state.attendanceId).then(res => {
            const utcMoment = moment.utc(res.attendance.createdAt)
            const istMoment = utcMoment.tz("Asia/Kolkata")
            const currentDate = new Date()

            if (istMoment.date() === currentDate.getDate() && istMoment.month() === currentDate.getMonth()
                && istMoment.year() === currentDate.getFullYear()) {
                setDisabled(false)
            }

            setAttendanceData(res.attendance)

            let numbers = 0
            res.attendance.attendanceRecords.map(student => {
                if (student.present) {
                    numbers += 1
                }
            })
            setPresent(numbers)
        })
    }, [refresh])

    const markAbsentBySeatNumber = (seatNumber) => {
        markAttendanceByTeacher(state.attendanceId, seatNumber, false).then(res => {
            setRefresh(prev => !prev)
        })
    }

    const markPresentByTeacherBySeatNumber = (seatNumber) => {
        markAttendanceByTeacher(state.attendanceId, seatNumber, true).then(res => {
            setRefresh(prev => !prev)
        })
    }

    const downloadPdf = () => {
        const data = attendanceData.attendanceRecords.map(record => [record.seatNumber, record.name, record.email, record.present ? "P" : "A"])
        const headers = [["Seat Number", "Name", "Email", "Present"]]
        const pdf = new jsPDF()
        pdf.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 10 }
        })
        const fileName = `${attendanceData.course}_${attendanceData.semester}_${attendanceData.subject}_${attendanceData.subjectType}_${attendanceData.batch}.pdf`
        pdf.save(fileName)
    }


    const filteredData = attendanceData?.attendanceRecords?.filter((item) =>
        item?.seatNumber?.includes(searchQuery) || item?.last3Digits?.includes(searchQuery)
    );

    //elements
    const attendanceRecordEl = attendanceData.attendanceRecords ? attendanceData?.attendanceRecords.map((el, i) => {
        const utcMoment = moment.utc(el.markedAt)
        const istMoment = utcMoment.tz("Asia/Kolkata")
        el.markedAt = istMoment.format()

        // Add a new column for the Roll No of the seat number
        el.last3Digits = el.seatNumber.slice(-3);

        return (
            <tr key={i} className={el.present ? "bg-success text-white" : "bg-danger text-white"}>
                <td>{el.seatNumber}</td>
                <td>{el.last3Digits}</td>
                <td>{el.name}</td>
                <td>{el.present ? "Present" : "Absent"}</td>
                <td>{el.markedAt ? `${el.markedAt.slice(0, 10)} ${el.markedAt.slice(11, 19)}` : ""}</td>
                <td className="bg-light text-center">
                    {el.present ? (
                        <button className="btn btn-danger btn-sm" onClick={() => markAbsentBySeatNumber(el.seatNumber)} disabled={disabled}>
                            Mark Absent
                        </button>
                    ) : (
                        <button className="btn btn-success btn-sm" onClick={() => markPresentByTeacherBySeatNumber(el.seatNumber)} disabled={disabled}>
                            Mark Present
                        </button>
                    )}
                </td>
            </tr>
        );
    }) : <tr><td>Wait</td></tr>;

    return (
        <ProtectTeacherRoute>
            <TeacherNavBar />
            <div className="container-fluid mt-5">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                    <div className="col-12">
                        <button className="btn btn-warning btn-sm mb-4 px-4 py-2" onClick={() => setRefresh(prevState => !prevState)}>Refresh</button><span> </span>
                        <button className="btn btn-warning btn-sm mb-4 px-4 py-2" onClick={downloadPdf}>Download PDF</button>
                        <p>{attendanceData.course} Sem {attendanceData.semester} {attendanceData.subjectType} Batch {attendanceData.batch}</p>
                        <h3>Present : {present}</h3>
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-md-6 col-12 d-flex justify-content-end">
                                <TextField
                                    className="col-12"
                                    type="text"
                                    id="outlined-basic"
                                    label="Search by Seat Number or Roll No..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <Collapse in={searchQuery !== ''}>
                            <div className="py-3">
                                <div className="text-center fs-3 fw-bold">
                                    Filtered Students
                                </div>
                                <div className="d-md-none d-block">
                                    {filteredData?.map((item, index) => (
                                        <div className="py-2" key={index}>
                                            <div className={`card border-0 text-white p-2 ${item.present ? 'border-3 bg-success' : 'border-3 bg-danger'}`}>
                                                {/* {JSON.stringify(item)} */}
                                                <div>
                                                    <span>Seat Number: {item.seatNumber}</span>
                                                </div>
                                                <hr />
                                                <div className="d-flex flex-wrap justify-content-between fw-bold">
                                                    <span className="col text-wrap">{item.name}</span>
                                                    <span className="col text-end">{item.present ? 'Present' : 'Absent'}</span>
                                                </div>
                                                <div className="col-12 pt-2 bg-transparent">
                                                    {item.present ? (
                                                        <button className="btn col-12 btn-danger btn-sm" onClick={() => markAbsentBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                            Mark Absent
                                                        </button>
                                                    ) : (
                                                        <button className="btn col-12 btn-success btn-sm" onClick={() => markPresentByTeacherBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                            Mark Present
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-none d-md-block">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Seat Number</th>
                                                <th>Roll No</th>
                                                <th>Name</th>
                                                <th>Present</th>
                                                {/* <th>Date Time</th> */}
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.map((item, index) => (
                                                <tr key={index} className={item.present ? "text-white bg-success" : "text-white bg-danger"}>
                                                    <td>{item.seatNumber}</td>
                                                    <td>{item.last3Digits}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.present ? 'Yes' : 'No'}</td>
                                                    {/* <td>{item.dateTime}</td> */}
                                                    <td className="bg-light text-center">
                                                        {item.present ? (
                                                            <button className="btn btn-danger btn-sm" onClick={() => markAbsentBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                                Mark Absent
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-success btn-sm" onClick={() => markPresentByTeacherBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                                Mark Present
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr />
                        </Collapse>
                        <div className="py-4">
                            <div className="text-center fs-3 fw-bold">
                                All Students
                            </div>
                            <div className="d-md-none d-block">
                                {attendanceData?.attendanceRecords?.map((item, index) => (
                                    <div className="py-2" key={index}>
                                        <div className={`card border-0 text-white p-2 ${item.present ? 'border-3 bg-success' : 'border-3 bg-danger'}`}>
                                            {/* {JSON.stringify(item)} */}
                                            <div>
                                                <span>Seat Number: {item.seatNumber}</span>
                                            </div>
                                            <hr />
                                            <div className="d-flex flex-wrap justify-content-between fw-bold">
                                                <span className="col text-wrap">{item.name}</span>
                                                <span className="col text-end">{item.present ? 'Present' : 'Absent'}</span>
                                            </div>
                                            <div className="col-12 pt-2 bg-transparent">
                                                {item.present ? (
                                                    <button className="btn col-12 btn-danger btn-sm" onClick={() => markAbsentBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                        Mark Absent
                                                    </button>
                                                ) : (
                                                    <button className="btn col-12 btn-success btn-sm" onClick={() => markPresentByTeacherBySeatNumber(item.seatNumber)} disabled={disabled}>
                                                        Mark Present
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-none d-md-block">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Seat Number</th>
                                            <th>Roll No</th>
                                            <th>Name</th>
                                            <th>Present</th>
                                            <th>Date Time</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {attendanceRecordEl}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectTeacherRoute>
    );
}

export default Attendance;
