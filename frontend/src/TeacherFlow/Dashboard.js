import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProtectTeacherRoute } from "../manageRoutes/ProtectRoutes";
import TeacherNavBar from "../compoents/TeacherNavBar";
import { FormControl, InputLabel, MenuItem, Select, Typography, List, ListItem, Collapse, setRef } from '@mui/material';
import { getAllCourses } from "../actions/courseActions";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAuthStore } from "../store/store";
import { getSingleTeacher, updateTeacherByTeacher } from "../actions/teacherActions";

const TeacherDashboard = () => {

    const user = useAuthStore.getState().user

    const navigate = useNavigate()
    const [courses, setAllCourses] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(1)
    const [selectSubjectType, setSelectSubjectType] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")

    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false)

    const [updateIndex, setUpdateIndex] = useState()

    const [queryUpdate, setQueryUpdate] = useState({
        error: '',
        errorMessage: '',
        selectQuery: []
    });

    const [fieldErrors, setFieldErrors] = useState({
        courseName: '',
        semester: '',
        subject: '',
        type: '',
        batch: '',
    });

    const { error, errorMessage, selectQuery } = queryUpdate;

    useEffect(() => {
        setAvailableCourses([...new Set(courses.map(subject => subject.courseName))]);
        setAvailableSemesters([...new Set(courses.map(subject => subject.semester))]);
        setAvailableSubjects([...new Set(courses.flatMap(subject => subject.subjects))]);
    }, [courses]);

    // Update availableSemesters whenever selectedCourse changes
    useEffect(() => {
        if (selectedCourse === '') {
            // If 'All Courses' is selected, show all unique semesters
            setAvailableSemesters([...new Set(courses.map(subject => subject.semester))]);
        } else {
            // If a specific course is selected, show only semesters available in that course
            setAvailableSemesters(
                [...new Set(courses.filter(subject => subject.courseName === selectedCourse).map(subject => subject.semester))]
            );
        }
    }, [selectedCourse, courses]);

    useEffect(() => {
        getAllCourses().then(res => {
            setAllCourses(res.courses.reverse())
        })
        getTeacher(user.email)
    }, [refresh])

    const getTeacher = (teacherEmail) => {
        getSingleTeacher(teacherEmail).then(res => {
            // console.log(res.data)
            setQueryUpdate({ ...queryUpdate, selectQuery: res?.data?.selectQuery })
        })
    }

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value)
        setSelectedSemester('')
    }

    const addToSelectQuery = () => {
        // Basic input validation
        const newErrors = {
            courseName: !selectedCourse ? 'Course Name is required.' : '',
            semester: !selectedSemester ? 'Semester is required.' : '',
            subject: !selectedSubject ? 'Subject is required.' : '',
            type: !selectSubjectType ? 'Type is required.' : '',
            batch: !selectedBatch ? 'Batch is required.' : '',
        };

        if (Object.values(newErrors).some((error) => error !== '')) {
            setFieldErrors(newErrors);
            return;
        }

        let tempSelectQuery = selectQuery;

        if (updateIndex !== -1) {
            // Update existing item
            tempSelectQuery[updateIndex] = {
                course: selectedCourse,
                semester: selectedSemester,
                subject: selectedSubject,
                subjectType: selectSubjectType,
                batch: selectedBatch,
            };
            setUpdateIndex(-1);
            updateTeacherByTeacher(user.teacherData._id, queryUpdate).then(responseData => {
                console.log(responseData)
                if (responseData.success === true) {
                    setRefresh(true)
                    setIsUpdate(false)
                }
            })
        } else {
            // Add new item
            tempSelectQuery.push({
                course: selectedCourse,
                semester: selectedSemester,
                subject: selectedSubject,
                subjectType: selectSubjectType,
                batch: selectedBatch,
            });
            
            setQueryUpdate((prevData) => {
                return {
                    ...prevData,
                    selectQuery: tempSelectQuery,
                };
            });
            console.log(queryUpdate)
            updateTeacherByTeacher(user.teacherData._id, queryUpdate).then(responseData => {
                console.log(responseData)
                if (responseData.success === true) {
                    setRefresh(true)
                }
            })
        }

        setSelectedCourse('');
        setSelectedSemester('');
        setSelectedSubject('');
        setSelectSubjectType('');
        setSelectedBatch(1);
        setFieldErrors({
            courseName: '',
            semester: '',
            subject: '',
            type: '',
            batch: '',
        });
        setRefresh(false)
    };

    const handleUpdateTeacher = (data) => {
        updateTeacherByTeacher(user.teacherData._id, data).then(responseData => {
            // console.log(responseData)
            if (responseData.success === true) {
                navigate('/teacher-dashboard')
            }
        })
    }

    const handleRemoveQuery = (index) => {
        const updatedSelectQuery = [...queryUpdate.selectQuery];
        updatedSelectQuery.splice(index, 1);
        
        setQueryUpdate({ ...queryUpdate, selectQuery: updatedSelectQuery });
        // console.log(updatedSelectQuery)
        updateTeacherByTeacher(user.teacherData._id, {selectQuery: updatedSelectQuery}).then(responseData => {
            // console.log(responseData)
            if (responseData.success === true) {
                setRefresh(true)
            }
        })
        setRefresh(false)
    };

    return (
        <ProtectTeacherRoute>
            {/* <div>
                <TeacherNavBar />
            </div>
            <div className="container-fluid py-5 d-flex flex-wrap justify-content-around align-items-start ">
                <div className="py-5 col-md-5 col-10 sticky-md-top">
                    <div className="fs-4 fw-bold py-3">
                        Update Your Courses and Semester
                    </div>
                    <div className="mb-3">
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
                        {fieldErrors.courseName && <div style={{ color: 'red' }}>{fieldErrors.courseName}</div>}
                    </div>

                    <div className="mb-3">
                        <FormControl fullWidth>
                            <InputLabel>Select Semester</InputLabel>
                            <Select
                                value={selectedSemester}
                                label="Select Semester"
                                onChange={(e) => {
                                    setSelectedSemester(e.target.value)
                                    setSelectedSubject('')
                                    setSelectedBatch(1)
                                }}
                            >
                                <MenuItem value="">All Semesters</MenuItem>
                                {[...new Set(courses.filter(el => el.courseName === selectedCourse).map(el => el.semester))].map(sem => (
                                    <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                                ))}
                            </Select>
                            {fieldErrors.semester && <div style={{ color: 'red' }}>{fieldErrors.semester}</div>}
                        </FormControl>
                    </div>
                    <div className="mb-3">
                        {isUpdate ? <div className="text-danger text-center">If you don't get dropdown for Subjects select semester again</div> : null}
                        <FormControl fullWidth>
                            <InputLabel>Select Subject</InputLabel>
                            <Select
                                value={selectedSubject}
                                label="Select Subject"
                                onChange={(e) => {
                                    setSelectedSubject(e.target.value)
                                    setSelectedBatch(1)
                                }}
                            >
                                <MenuItem value={selectedSubject === '' ? '' : selectedSubject}>{selectedSubject === '' ? 'All Subject' : selectedSubject}</MenuItem>
                                {[...new Set(courses.filter(el => el.courseName === selectedCourse && el.semester === selectedSemester).map(el => el.subjects))].map(subjects => {
                                    return subjects.map(subject => <MenuItem key={subject} value={subject}>{subject}</MenuItem>)
                                })}
                            </Select>
                            {fieldErrors.subject && <div style={{ color: 'red' }}>{fieldErrors.subject}</div>}
                        </FormControl>
                    </div>
                    <div className="mb-3">
                        <FormControl fullWidth>
                            <InputLabel>Select type of Subject</InputLabel>
                            <Select
                                value={selectSubjectType}
                                label="Select type of Subject"
                                onChange={(e) => setSelectSubjectType(e.target.value)}
                            >
                                <MenuItem value="">Select Type of Subject</MenuItem>
                                <MenuItem value={"Theory"}>Theory</MenuItem>
                                <MenuItem value={"Practical"}>Practical</MenuItem>
                            </Select>
                            {fieldErrors.type && <div style={{ color: 'red' }}>{fieldErrors.type}</div>}
                        </FormControl>
                    </div>
                    <div className="mb-3">
                        <FormControl fullWidth>
                            <InputLabel>Select Batch</InputLabel>
                            <Select
                                value={selectedBatch}
                                label="Select Subject"
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <MenuItem value={1}>{1}</MenuItem>
                                <MenuItem value={2}>{2}</MenuItem>
                                <MenuItem value={3}>{3}</MenuItem>
                                <MenuItem value={4}>{4}</MenuItem>
                            </Select>
                            {fieldErrors.batch && <div style={{ color: 'red' }}>{fieldErrors.batch}</div>}
                        </FormControl>
                    </div>
                    <div className="py-3">
                        {isUpdate ?
                            <button onClick={() => addToSelectQuery()} className="btn btn-warning col-12">
                                Update
                            </button> :
                            <>
                                <button onClick={() => addToSelectQuery()} className="btn btn-danger col-12">
                                    Add Subject
                                </button>
                            </>
                        }
                    </div>
                </div>
                <div className="col-md-5 col-10">
                    <div className="py-5">
                        <Collapse in={selectedCourse !== ''}>
                            <div className="fs-4 fw-bold py-3">
                                Add New Course
                            </div>
                            <div className="card p-2 fs-5 bg-transparent border-primary">
                                <div><span className="fw-bold">Course: </span>{selectedCourse}</div>
                                <div><span className="fw-bold">Semester: </span>{selectedSemester}</div>
                                <div><span className="fw-bold">Subject: </span>{selectedSubject} - ({selectSubjectType})</div>
                                <div><span className="fw-bold">Batch: </span>{selectedBatch}</div>
                                <hr />
                            </div>
                        </Collapse>
                        <div className="fs-4 fw-bold py-3">
                            Courses and semesters assigned to you
                        </div>
                        {queryUpdate.selectQuery.length === 0 ? <div>No Data</div> : <div>
                            {queryUpdate.selectQuery.reverse().map((q, i) => (
                                <div key={i} className="py-2">
                                    <div className="card p-2 fs-5 bg-transparent border-primary">
                                        <div><span className="fw-bold">Course: </span>{q.course}</div>
                                        <div><span className="fw-bold">Semester: </span>{q.semester}</div>
                                        <div><span className="fw-bold">Subject: </span>{q.subject} - ({q.subjectType})</div>
                                        <div><span className="fw-bold">Batch: </span>{q.batch}</div>
                                        <hr />
                                        <div className="d-flex flex-wrap py-3 justify-content-around align-items-center">
                                            <button className="btn btn-warning col-md-5 col-12" onClick={() => {
                                                setSelectedCourse(q.course);
                                                setSelectedSemester(q.semester);
                                                setSelectedSubject(q.subject);
                                                setSelectSubjectType(q.subjectType);
                                                setSelectedBatch(q.batch)
                                                setIsUpdate(true)
                                                setUpdateIndex(i)
                                            }}>Update</button>
                                            <button className="btn btn-danger col-md-5 col-12" onClick={() => handleRemoveQuery(i)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>
                </div>
            </div > */}
            <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div className="col-md-6 col-10">
                    <div>
                        <h1 className="m-0">The Portal for teachers and students have been disabled.</h1>
                        <h1 className="m-0">You can use the Mobile App instead for location based attendance based marking</h1>
                    </div>
                </div>
            </div>

        </ProtectTeacherRoute >
    )
}

export default TeacherDashboard;
