import { useState, useEffect } from "react"
import AdminNavBar from "../compoents/AdminNavBar"
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes"
import { getAllCourses, updateCourse } from "../actions/courseActions"
import { Collapse, FormControl } from "@mui/material"
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { addCourse } from "../actions/adminActions"

const ManageCourses = () => {

    const [courses, setAllCourses] = useState([])
    const [showSubjects, setShowSubjects] = useState(null)
    const [isUpdate, setIsUpdate] = useState(false)
    const [showUpdatingFields, setShowUpdatingFields] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [courseForm, setCourseForm] = useState({
        courseId:'',
        courseName: '',
        semester: '',
        subjectData: '',
        subjects: []
    })

    const [errors, setErrors] = useState({
        courseName: '',
        semester: '',
        subjectData: '',
        subjects: []
    });
      
    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        // Validate courseName
        if (courseForm.courseName.trim() === '') {
            newErrors.courseName = 'Course Name is required';
            valid = false;
        } else {
            newErrors.courseName = '';
        }

        // Validate semester
        if (courseForm.semester === '') {
            newErrors.semester = 'Semester is required';
            valid = false;
        } else {
            newErrors.semester = '';
        }

        // Validate subjectData
        if (courseForm.subjectData.trim() === '' && courseForm.subjects.length === 0) {
            newErrors.subjectData = 'Subject Data is required';
            valid = false;
        } else {
            newErrors.subjectData = '';
        }

        // Validate subjects array
        if (courseForm.subjects.length === 0) {
            newErrors.subjects = 'At least one subject is required';
            valid = false;
        } else {
            newErrors.subjects = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        if (validateForm()) {
          // Form is valid, proceed with submission or other actions
          // Check if the course is already added
        
            addCourse(courseForm).then((res) => {
              if (res.success) {
                setRefresh(true);
                setShowUpdatingFields(false);
              }
            });

          }
         else {
          // Form has errors, handle them as needed
          console.log('Form has errors');
        }
        setRefresh(false);
      };

    // const [subjectData, setSubjectData] = useState('')

    const { courseName, semester, subjectData, subjects, courseId } = courseForm

    const handleCollapseToggle = (index) => {
        setShowSubjects(showSubjects === index ? null : index);
    };

    const handleChange = name => e => {
        setShowUpdatingFields(true)
        setCourseForm({ ...courseForm, [name]: e.target.value })
        setErrors({
            ...errors,
            [name]: '',
        });
    }

    const handleUpdate = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Form is valid, proceed with submission or other actions
            // console.log('Form submitted:', courseForm);
            updateCourse(courseForm).then(res => {
                if (res.success) {
                    setRefresh(true)
                    setShowUpdatingFields(false)
                } 
            })
        } else {
            // Form has errors, handle them as needed
            console.log('Form has errors');
        }
        setRefresh(false)
        setCourseForm(prevState =>{
            return {...prevState,subjects:[]}
        })
        setIsUpdate(false)
    };

    useEffect(() => {
        getAllCourses().then(res => {
            setAllCourses(res.courses.reverse())
        })
    }, [refresh])

    const handleRemoveSubject = (index) => {
        const updateSubjectArray = [...courseForm.subjects];
        updateSubjectArray.splice(index, 1);
        setCourseForm({ ...courseForm, subjects: updateSubjectArray });
    };

    const addSubjects = () => {
        if (subjectData === '') {
            setCourseForm({
                ...courseForm,
                error: 'subjectEmpty',
                errorMessage: 'Subjects required for teacher to register'
            })
        } else {
            let tempSubjects = subjects
            tempSubjects.push(subjectData)

            setCourseForm(prevData => {
                return {
                    ...prevData,
                    selesubjectsctQuery: tempSubjects,
                    subjectData: ''
                }
            })
        }

    }

    return (
        <ProtectAdminRoute>
            <AdminNavBar />
            <div className="container-fluid py-5" style={{ height: '80vh' }}>
                <div className="p-3 d-flex flex-wrap justify-content-around align-items-start">
                    <div className="col-md-5 col-12 sticky-md-top">
                        <div className="py-5">
                            <h3>
                            <div className="py-3 fw-bold text-danger">
                                Add New Courses
                            </div>
                            </h3>
                            <div className="mb-3">
                                <TextField
                                    className="col-12"
                                    error={errors.courseName ? true : false}
                                    id="outlined-basic"
                                    label={errors.courseName ? `${errors.courseName}` : "Course Name"}
                                    value={courseName}
                                    variant="outlined"
                                    onChange={handleChange('courseName')} />
                                {/* <span className="error">{errors.courseName}</span> */}
                            </div>
                            <div className="mb-3">
                                
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-helper-label">{errors.semester ? <span className="text-danger">{errors.semester}</span> : <span>Semester</span>}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    className="col-12"
                                    variant="outlined"
                                    error={errors.semester ? true : false}
                                    value={semester}
                                    label={errors.semester ? `${errors.semester}` : "Semester"}
                                    onChange={handleChange('semester')}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                </Select>
                            </FormControl>
                                {/* <span className="error">{errors.semester}</span> */}


                            </div>
                            <hr className="m-2" />
                            <div className="my-3">
                                <TextField
                                    className="col-12"
                                    error={errors.subjectData ? true : false}
                                    id="outlined-basic"
                                    label={errors.subjectData ? `${errors.subjectData}` : "Enter Subject Name"}
                                    value={subjectData}
                                    variant="outlined"
                                    onChange={handleChange('subjectData')} />
                            </div>
                            {/* {error === 'subjectEmpty' ? <div className="text-center text-danger">{errorMessage}</div> : null} */}
                            {subjectData !== '' ?
                                <button onClick={subjectData !== '' ? addSubjects : null} className="btn my-3 btn-danger col-12">
                                    Add Subject
                                </button> :
                                <button disabled className="btn my-3 btn-danger col-12">
                                    Add Subject
                                </button>}
                            <div>
                                {isUpdate ? <button onClick={handleUpdate} disabled={subjects.length === 0 ? true : false} className="btn btn-warning col-12" >
                                    Update Course
                                </button> : subjects.length === 0 ? <div className="text-danger text-center">Need atleast one subject</div> : 
                                <button onClick={handleSubmit} className="btn btn-danger col-12">
                                    Create Course
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 col-12 py-5" style={{ overflow: 'scroll' }}>
                        <div className="container">
                            <Collapse in={showUpdatingFields}>
                                <div className="card p-2 bg-transparent border-success border-2 rounded">
                                    <div className="fs-4">
                                        Course Name: {courseName}
                                    </div>
                                    <div className="fs-4">
                                        Semester: {semester}
                                    </div>
                                    <div className="py-2">
                                        {subjects.length === 0 ? <div>
                                            No Subjects Added, Add Subjects
                                        </div> : <div><span className="fs-5">Subjects</span><div>{subjects.map((s, i) => (
                                            <div key={i}>
                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                    <div>{s}</div>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveSubject(i)}>Remove</button>
                                                </div>
                                                <hr />
                                            </div>
                                        ))}</div></div>}
                                    </div>
                                </div>
                            </Collapse>
                            {/* <Collapse in={!showUpdatingFields}> */}
                            {courses.length === 0 ? <div className="text-center">
                                NO COURSES ADDED
                            </div> : <div className="py-5">
                                {courses.map((c, i) => (
                                    <div key={i} className="card bg-transparent border-primary border-2 rounded-lg p-2 my-3">
                                        <div className="">
                                            <div className="fs-4">
                                                {c.courseName}
                                            </div>
                                            <div className="fs-4">
                                                Semester: {c.semester}
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <button onClick={() => handleCollapseToggle(i)} className="btn btn-sm btn-primary">
                                                View Subjects
                                            </button>
                                            <button onClick={() => {setCourseForm({
                                                ...courseForm,
                                                courseId: c._id,
                                                courseName: c.courseName,
                                                semester: c.semester,
                                                subjects: c.subjects
                                            })
                                            setShowUpdatingFields(true)
                                            setIsUpdate(true)
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }} className="btn btn-sm btn-warning">
                                                Update Course
                                            </button>                               
                                        </div>
                                        <Collapse in={i === showSubjects}>
                                            <div>
                                                <ul>
                                                    {c.subjects?.map((s, i) => (
                                                        <li key={i}>{s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Collapse>
                                    </div>
                                ))}
                            </div>}
                            {/* </Collapse> */}
                        </div>
                        {/* {JSON.stringify(courses[0])} */}
                    </div>
                </div>
            </div>
        </ProtectAdminRoute>
    )
}

export default ManageCourses