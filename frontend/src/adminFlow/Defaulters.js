
import { getDefaulters, getDefaultersByFilters, getCummultiveAttendance } from "./../actions/adminActions"
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes"
import { getAllCourses } from "./../actions/courseActions"
import { useState, useEffect } from "react"
import TextField from '@mui/material/TextField'
import AdminNavBar from "../compoents/AdminNavBar"
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Defaulters = () => {

    const [students, setStudents] = useState([])
    const [startDate, setStartDate] = useState(new Date()); // Initial value
    const [endDate, setEndDate] = useState(new Date());

    const [formData, setFormData] = useState({
        course: '',
        semester: '',
        percentage: '',
        error: '',
        errorMessage: ''
    })

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const [courses, setAllCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState("")
    const [selectedSemester, setSelectedSemester] = useState("all")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedSubjectType, setSelectedSubjectType] = useState("both")

    const [downloadButtonFlag, setDownloadButtonFlag] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        getAllCourses().then(res => {
            setAllCourses(res.courses.reverse())
        })
    }, [refresh])

    useEffect(() => {
        setAvailableCourses([...new Set(courses.map(subject => subject.courseName))]);
        setAvailableSemesters([...new Set(courses.map(subject => subject.semester))]);
        setAvailableSubjects([...new Set(courses.flatMap(subject => subject.subjects))]);
    }, [courses]);

    const { course, semester, percentage, error, errorMessage } = formData

    const getDefaultersByCourseAndSem = () => {
        getDefaulters({ course: selectedCourse, semester: selectedSemester, startDate, endDate }).then(res => {
            // console.log(res)
            if (!res.success) {
                setStudents([])
            } else {
                let studentsRes = (res.students)
                // console.log(studentsRes)
                studentsRes = studentsRes.map((el) => {
                    return {
                        percentage: ((el.lecturesPresent / el.totalLectures) * 100).toFixed(2), ...el
                    }
                })
                setStudents(studentsRes)
                setDownloadButtonFlag(false)
            }
        })
    }

    const getDefaultersByCourseAndSemAndSubject = () => {
        getDefaultersByFilters({ course: selectedCourse, semester: selectedSemester, subject: selectedSubject, subjectType: selectedSubjectType, startDate, endDate }).then(res => {
            // console.log(res)
            if (!res.success) {
                setStudents([])
            } else {
                let studentsRes = (res.students)
                // console.log(studentsRes)
                studentsRes = studentsRes.map((el) => {
                    return {
                        ...el, percentage: ((el.lecturesPresent / el.totalLectures) * 100).toFixed(2)
                    }
                })
                setStudents(studentsRes)
                setDownloadButtonFlag(true)
            }
        })
    }

    const handleChange = name => e => {
        setFormData({ ...formData, error: '', errorMessage: '', [name]: e.target.value })
    }

    const convertToPdf = (subject) => {
        let cutoff = parseInt(percentage);
        const defaulters = students.filter(student => parseInt(student.percentage) < cutoff);
        const defaultersCsv = Papa.unparse(defaulters);

        // Convert CSV to PDF
        const pdf = new jsPDF();

        // Set up the table headers
        const headers = [['SeatNumber', 'Name', 'Email', 'LecturesPresent', 'Total Lectures', `Percentage below ${percentage}%`]];

        // Extract data for the table
        const data = defaulters.map(student => [student.seatNumber, student.name, student.email, student.lecturesPresent, student.totalLectures, student.percentage]);

        // Add the table to the PDF
        pdf.autoTable({
            head: headers,
            body: data,
            startY: 20, // Adjust the starting position as needed
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 10 },
        });
        let fileName = `${selectedCourse}_Sem${selectedSemester}_defaulters.pdf`
        if (subject) {
            fileName = `${selectedCourse}_Sem${selectedSemester}_${subject}_defaulters.pdf`
        }
        // Download the PDF
        pdf.save(fileName);
    };

    const convertToCsvAndDownload = (subject) => {
        let cutoff = parseInt(percentage);
        const defaulters = students.filter(student => parseInt(student.percentage) < cutoff);

        const headers = [['SeatNumber', 'Name', 'Email', 'LecturesPresent', 'TotalLectures',]]
        headers[0].push(`Percentage below ${percentage}%`)
        const data = defaulters.map(student => [student.seatNumber, student.name, student.email, student.lecturesPresent, student.totalLectures, student.percentage])
        const defaultersCsv = Papa.unparse({
            fields: headers[0],
            data: data
        });

        // Create a Blob from the CSV data
        const csvBlob = new Blob([defaultersCsv], { type: 'text/csv' });

        // Create a download link for the CSV file
        const csvDownloadLink = document.createElement('a');
        csvDownloadLink.href = URL.createObjectURL(csvBlob);

        let fileName = `${selectedCourse}_Sem${selectedSemester}_defaulters.csv`
        if (subject) {
            fileName = `${selectedCourse}_Sem${selectedSemester}_${subject}_defaulters.csv`
        }
        csvDownloadLink.download = fileName;

        // Append the link to the document
        document.body.appendChild(csvDownloadLink);

        // Trigger a click on the link to start the download
        csvDownloadLink.click();

        // Remove the link from the document
        document.body.removeChild(csvDownloadLink);
    };

    const getWholeAttendanceData = () => {
        getCummultiveAttendance({ course: selectedCourse, semester: selectedSemester, startDate, endDate }).then(res => {
            if (!res.success) {
                alert(res.message)
            } else {
                let studentsRes = (res.students)

                const allKeys = Array.from(new Set(studentsRes.flatMap(obj => Object.keys(obj))));

                if (!allKeys.includes('percentage')) {
                    allKeys.push('percentage');
                }

                studentsRes = studentsRes.map(obj => {
                    const newObj = { ...obj };
                    allKeys.forEach(key => {
                        newObj[key] = newObj[key] !== undefined ? newObj[key] : 0;
                    });
                    newObj.percentage = ((newObj.lecturesPresent / newObj.totalLectures) * 100).toFixed(2);
                    return newObj;
                });

                const csvData = [allKeys, ...studentsRes.map(obj => allKeys.map(key => obj[key]))];

                const defaultersCsv = Papa.unparse(csvData);

                // Create a Blob from the CSV data
                const csvBlob = new Blob([defaultersCsv], { type: 'text/csv' });

                // Create a download link for the CSV file
                const csvDownloadLink = document.createElement('a');
                csvDownloadLink.href = URL.createObjectURL(csvBlob);

                let fileName = `${selectedCourse}_Sem${selectedSemester}_defaulters.csv`

                csvDownloadLink.download = fileName;

                // Append the link to the document
                document.body.appendChild(csvDownloadLink);

                // Trigger a click on the link to start the download
                csvDownloadLink.click();

                // Remove the link from the document
                document.body.removeChild(csvDownloadLink);
            }
        })
    }

    return (
        <>
            <ProtectAdminRoute>
                <AdminNavBar />
                <div className="conatiner-fluid p-3 d-flex flex-wrap justify-content-around align-items-start">
                    <div className="col-md-5 col-12 py-2 sticky-md-top">
                        <div className="">
                            <h3>Filter for Attendance</h3>
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-md-8 col-12 my-3 me-1">
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={['', ...availableCourses]}
                                            value={selectedCourse}
                                            onChange={(event, newValue) => {
                                                setSelectedCourse(newValue === '' ? null : newValue);
                                                setSelectedSemester(selectedSemester);
                                                setSelectedSubject(selectedSubject);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Select Course" />}
                                        />
                                        {/* {fieldErrors.courseName && <div style={{ color: 'red' }}>{fieldErrors.courseName}</div>} */}
                                    </FormControl>
                                </div>

                                <div className="col-md-4 col-12 my-3 ms-1">
                                    <FormControl fullWidth>
                                        <InputLabel>Select Semester</InputLabel>
                                        <Select
                                            value={selectedSemester}
                                            label="Select Semester"
                                            onChange={(e) => {
                                                setSelectedSemester(e.target.value)
                                            }}
                                        >
                                            <MenuItem value="all">All Semesters</MenuItem>
                                            {[...new Set(courses.filter(el => el.courseName === selectedCourse).map(el => el.semester))].map(sem => (
                                                <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="d-flex flex-wrap">
                                    <label htmlFor="endTime" className="pt-2 m-0 form-label">Start Date:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate.toISOString().slice(0, 10)} // Format for input value
                                        onChange={(event) => setStartDate(new Date(event.target.value))}
                                    />
                                </div>
                                <div className="d-flex flex-wrap">
                                    <label htmlFor="endTime" className="pt-2 m-0 form-label">End Date:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={endDate.toISOString().slice(0, 10)} // Format for input value
                                        onChange={(event) => setEndDate(new Date(event.target.value))}
                                    />
                                </div>
                            </div>

                            <button className="btn btn-danger col-12 my-1" onClick={() => getDefaultersByCourseAndSem(course, parseInt(semester))}
                                disabled={selectedCourse === "all" || selectedSemester === "all"}
                            >Get</button>
                            <div className="my-3 d-flex flex-wrap justify-content-around align-items-center">
                                <TextField
                                    type="number"
                                    className="col-md-6 my-2 col-12"
                                    error={error === "userForm" ? true : false}
                                    id="outlined-basic"
                                    disabled={(students.length > 0 && !downloadButtonFlag) ? false : true}
                                    label={error === 'userForm' ? `${errorMessage} Percentage` : "Percentage"}
                                    value={percentage}
                                    variant="outlined"
                                    onChange={handleChange('percentage')} />
                                <button onClick={handleClick} className={`btn btn-outline-danger btn-lg ${(students.length > 0 && !downloadButtonFlag) ? null : 'disabled'}`}>
                                    Download
                                </button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                        convertToPdf()
                                        handleClose()
                                    }}>Download PDF</MenuItem>
                                    <MenuItem onClick={() => {
                                        convertToCsvAndDownload()
                                        handleClose()
                                    }}>Download CSV</MenuItem>
                                    <MenuItem onClick={() => {
                                        getWholeAttendanceData()
                                        handleClose()
                                    }}>Download Whole Attendance</MenuItem>
                                </Menu>
                                {/* <button className="btn btn-danger col-12 col-md-2" onClick={() => getDefaultersByCourseAndSem(course, parseInt(semester))}>Sort</button> */}
                                {/* <button className={`my-2 btn btn-danger col-12 col-md-3 ${(students.length > 0 && !downloadButtonFlag) ? null : 'disabled'}`} onClick={() => convertToPdf()}>Download PDF</button>
                                <button className={`my-2 btn btn-danger col-12 col-md-3 ${(students.length > 0 && !downloadButtonFlag) ? null : 'disabled'}`} onClick={() => convertToCsvAndDownload()}>Download CSV</button>
                                <div className="col-12">
                                    <button className={`my-2 btn btn-danger col-12 ${((selectedCourse && selectedCourse !== "all") && (selectedSemester && selectedSemester !== "all")) ? null : 'disabled'}`} onClick={getWholeAttendanceData}>Download Whole Attendance</button>
                                </div> */}
                            </div>
                            <hr />
                            <div>
                                <h3>Filters</h3>
                                <FormControl fullWidth>
                                    <InputLabel>Select Subject</InputLabel>
                                    <Select
                                        value={selectedSubject}
                                        label="Select Subject"
                                        onChange={(e) => {
                                            setSelectedSubject(e.target.value)
                                        }}
                                    >
                                        <MenuItem value="all">Select Subject</MenuItem>
                                        {[...new Set(courses.filter(el => el.courseName === selectedCourse && el.semester === selectedSemester).map(el => el.subjects))].map(subject => (
                                            subject.map(sub => (
                                                <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                                            ))
                                        ))}
                                    </Select>
                                </FormControl>
                                <br></br>
                                <hr />
                                <FormControl fullWidth>
                                    <InputLabel>Select Subject Type</InputLabel>
                                    <Select
                                        value={selectedSubjectType}
                                        label="Select Subject Type"
                                        onChange={(e) => {
                                            setSelectedSubjectType(e.target.value)
                                        }}
                                    >
                                        <MenuItem value="both">Theory+Practical</MenuItem>
                                        <MenuItem value="Theory">Theory</MenuItem>
                                        <MenuItem value="Practical">Practical</MenuItem>
                                    </Select>
                                </FormControl>

                                <p>Same date filters apply here</p>
                                <button className="btn btn-danger col-12 my-1" onClick={() => getDefaultersByCourseAndSemAndSubject()}
                                    disabled={selectedSubject === "all"}
                                >Get By Subject</button>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between">
                                <button className={`btn btn-danger col-12 col-md-5 my-1 ${(students.length > 0 && downloadButtonFlag) ? null : 'disabled'}`} onClick={() => convertToPdf(selectedSubject)}>Download PDF(Subject)</button>
                                <button className={`btn btn-danger col-12 col-md-5 my-1 ${(students.length) > 0 && downloadButtonFlag ? null : 'disabled'}`} onClick={() => convertToCsvAndDownload(selectedSubject)}>Download CSV(Subject)</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12" style={{ overflow: 'scroll' }}>
                        <div className="d-md-none d-block">
                            {students.length === 0 ? <tr>No Data</tr> :
                                students.map((s, i) => (
                                    <div key={i}>
                                        <div className={`card border-primary rounded-lg my-2 p-2 ${s.percentage < parseInt(percentage) ? 'border-3 border-danger text-white bg-danger' : 'border-3'}`}>
                                            <div>
                                                <span>{s.name}</span>
                                            </div>
                                            <div>
                                                <span>{s.seatNumber}</span>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <span>Lectures Present: {s.lecturesPresent}</span>
                                                <span>Total Lectures: {s.totalLectures}</span>
                                            </div>
                                            <span className="fw-bold">
                                                Percentage: {s.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="d-none d-md-block">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Seat Number</th>
                                        <th>Lectures Present</th>
                                        <th>Total Lectures</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? <tr>No Data</tr> :
                                        students.map((s, i) => (
                                            <tr key={i} className={s.percentage < parseInt(percentage) ? "table-danger" : ""}>
                                                <td>
                                                    {s.name}
                                                </td>
                                                <td>
                                                    {s.seatNumber}
                                                </td>
                                                <td>{s.lecturesPresent}</td>
                                                <td>{s.totalLectures}</td>
                                                <td>
                                                    {s.percentage}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </ProtectAdminRoute>
        </>
    )
}

export default Defaulters