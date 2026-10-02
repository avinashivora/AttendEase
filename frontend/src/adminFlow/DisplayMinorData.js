// import React, { useState, useEffect } from 'react';
// import { getAllMinors, getOneMinor, getAllProfessionalCourses, getAllLanguages, getAllStudentsByCategories } from '../actions/studentAction';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import TextField from '@mui/material/TextField';

// const Display = () => {
//     const [minorCourseArr, setMinorCourseArr] = useState([]);
//     const [minorCourse, setMinorCourse] = useState('');
//     const [stud, setStud] = useState([]);
//     const [tableEl, setTableEl] = useState('');
//     const [minorDetails, setMinorDetails] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [choice, setChoice] = useState('');
//     const [choicedata, setChoiceData] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCourse, setselectedCourse] = useState('')

//     useEffect(() => {
//         setCategories(["Minor", "Professional Courses", "Languages"]);
//         console.log(stud)
//     }, []);

//     useEffect(() => {
//         updateStudTable();
//     }, [stud]);

//     const updateStudTable = () => {
//         const tableRows = stud.map((item, index) => (
//             <tr key={index} className="table-row">
//                 <th scope="row">{index + 1}</th>
//                 <td>{item.name}</td>
//                 <td>{item.email}</td>
//                 <td>{item.seatno}</td>
//                 <td>{item.memberid}</td>
//                 <td>{item.mobileno}</td>
//                 <td>{item.programName}</td>
//                 <td>{item.language}</td>
//                 <td>{item.professionalcourse}</td>
//             </tr>
//         ));
//         setTableEl(tableRows);
//     };

//     const fetchOneMinor = async (courseName) => {
//         try {
//             const res = await getOneMinor(courseName);
//             const studArr = res.students.map(item => item);
//             setMinorDetails([res.capacity, res.remainingCapacity]);
//             setStud(studArr);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchMinorCourses = async () => {
//         try {
//             const res = await getAllMinors();
//             let arr = res.data.map(item => item.courseName);
//             setChoiceData(arr);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchProfessionalCourses = async () => {
//         try {
//             const res = await getAllProfessionalCourses();
//             let arr = res.data.map(item => item.profCourse);
//             setChoiceData(arr);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchLanguages = async () => {
//         try {
//             const res = await getAllLanguages();
//             let arr = res.data.map(item => item.langCourseList);
//             setChoiceData(arr);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchStudentsByCategory = async (category, selectedCourse) => {
//         try {
//             const res = await getAllStudentsByCategories(category, selectedCourse);
//             console.log('data', res)
//             const studArr = res.map(item => item);
//             setStud(studArr);
//             // setMinorDetails([res.capacity, res.remainingCapacity]);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleChange = async (event) => {
//         setselectedCourse(event.target.value);
//         let selectedCourse = event.target.value;

//         if (choice === "Minor") {
//             setMinorCourse(selectedCourse);
//             fetchOneMinor(selectedCourse);
//         } else if (choice === "Professional Courses") {
//             fetchStudentsByCategory('professionalcourse', selectedCourse);
//         } else if (choice === "Languages") {
//             fetchStudentsByCategory('language', selectedCourse);
//         }
//     };

//     const handleChoice = async (event) => {
//         const selectedChoice = event.target.value;
//         setChoice(selectedChoice);

//         if (selectedChoice === "Minor") {
//             fetchMinorCourses();
//         } else if (selectedChoice === "Professional Courses") {
//             fetchProfessionalCourses();
//         } else if (selectedChoice === "Languages") {
//             fetchLanguages();
//         }
//     };



//     const filteredData = stud?.filter((item) =>
//         item?.seatno?.includes(searchQuery)
//     );

//     return (
//         <div className="d-flex flex-wrap justify-content-center">
//             <div className="col-md-6 col-10">
//                 <label htmlFor="minorCourse" className="form-label">Filter Using</label>
//                 <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
//                     <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">Categories</InputLabel>
//                         <Select
//                             labelId="demo-simple-select-label"
//                             id="categories"
//                             value={choice}
//                             label="Categories"
//                             name="categories"
//                             onChange={handleChoice}
//                         >
//                             {categories.map((item, index) => (
//                                 <MenuItem key={index} value={item}>{item}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>

//                 <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
//                     <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">Select</InputLabel>
//                         <Select
//                             labelId="demo-simple-select-label"
//                             id="choice"
//                             value={selectedCourse}
//                             label="Select"
//                             name="choice"
//                             onChange={handleChange}
//                         >
//                             {choicedata.map((item, index) => (
//                                 <MenuItem key={index} value={item}>{item}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>

//                 <div className="col-md-6 col-12 d-flex justify-content-end">
//                     <TextField
//                         className="col-12"
//                         type="text"
//                         id="outlined-basic"
//                         label="Search by Seat Number or Roll No..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>

//                 {minorDetails.length === 2 && (
//                     <div style={{ marginTop: "30px", marginBottom: "30px", fontWeight: "bold" }}>
//                         Total Seats: {minorDetails[0]} <br />
//                         Available Seats: {minorDetails[1]} <br />
//                         Students Enrolled: {minorDetails[0] - minorDetails[1]}<br />
//                     </div>
//                 )}

//                 {stud.length === 0 ? (
//                     <div>No Students Enrolled</div>
//                 ) : (
//                     <table className="table red">
//                         <thead>
//                             <tr className="red">
//                                 <th scope="col">#</th>
//                                 <th scope="col">Name</th>
//                                 <th scope="col">Email</th>
//                                 <th scope="col">Seat</th>
//                                 <th scope="col">Member ID</th>
//                                 <th scope="col">Mobile No.</th>
//                                 <th scope="col">Program</th>
//                                 <th scope="col">Language</th>
//                                 <th scope="col">Prof. Course</th>
//                             </tr>
//                         </thead>
//                         <tbody>{tableEl}</tbody>
//                     </table>
//                 )}
//             </div> 
//         </div>
//     );
// };

// export default Display;



import React, { useState, useEffect } from 'react';
import { getAllMinors, getOneMinor, getAllProfessionalCourses, getAllLanguages, getAllStudentsByCategories } from '../actions/formActions';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import { ProtectAdminRoute } from '../manageRoutes/ProtectRoutes';
import AdminNavBar from '../compoents/AdminNavBar';

const DisplayMinorData = () => {
    const [minorCourseArr, setMinorCourseArr] = useState([]);
    const [minorCourse, setMinorCourse] = useState('');
    const [stud, setStud] = useState([]);
    const [tableEl, setTableEl] = useState('');
    const [minorDetails, setMinorDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [choice, setChoice] = useState('');
    const [choicedata, setChoiceData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCourse, setselectedCourse] = useState('');
    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        setCategories(["Minor", "Professional Courses", "Languages"]);
        console.log(stud)
    }, []);

    useEffect(() => {
        console.log('filter')
        setFilteredData(stud?.filter((item) =>
            item?.seatno?.includes(searchQuery)
        ));
    }, [searchQuery, stud])

    useEffect(() => {
        updateStudTable();
    }, [filteredData]);

    const updateStudTable = () => {
        const tableRows = filteredData.map((item, index) => (
            <tr key={index} className="table-row">
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.seatno}</td>
                <td>{item.memberid}</td>
                <td>{item.mobileno}</td>
                <td>{item.programName}</td>
                <td>{item.language}</td>
                <td>{item.professionalcourse}</td>
            </tr>
        ));
        setTableEl(tableRows);
    };

    const fetchOneMinor = async (courseName) => {
        try {
            const res = await getOneMinor(courseName);
            const studArr = res.students.map(item => item);
            setMinorDetails([res.capacity, res.remainingCapacity]);
            setStud(studArr);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMinorCourses = async () => {
        try {
            const res = await getAllMinors();
            let arr = res.data.map(item => item.courseName);
            setChoiceData(arr);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProfessionalCourses = async () => {
        try {
            const res = await getAllProfessionalCourses();
            let arr = res.data.map(item => item.profCourse);
            setChoiceData(arr);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLanguages = async () => {
        try {
            const res = await getAllLanguages();
            let arr = res.data.map(item => item.langCourseList);
            setChoiceData(arr);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStudentsByCategory = async (category, selectedCourse) => {
        try {
            const res = await getAllStudentsByCategories(category, selectedCourse);
            console.log('data', res)
            const studArr = res.map(item => item);
            setStud(studArr);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = async (event) => {
        setselectedCourse(event.target.value);
        let selectedCourse = event.target.value;

        if (choice === "Minor") {
            setMinorCourse(selectedCourse);
            fetchOneMinor(selectedCourse);
        } else if (choice === "Professional Courses") {
            fetchStudentsByCategory('professionalcourse', selectedCourse);
        } else if (choice === "Languages") {
            fetchStudentsByCategory('language', selectedCourse);
        }
    };

    const handleChoice = async (event) => {
        const selectedChoice = event.target.value;
        setChoice(selectedChoice);

        if (selectedChoice === "Minor") {
            fetchMinorCourses();
        } else if (selectedChoice === "Professional Courses") {
            fetchProfessionalCourses();
        } else if (selectedChoice === "Languages") {
            fetchLanguages();
        }
    };

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(stud.map(student => ({
            seatNumber: student.seatno,
            programName: student.programName,
            fullName: student.name,
            emailId: student.email
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');

        XLSX.writeFile(wb, `${choice}-${selectedCourse}.xlsx`);
    };



    return (
        <ProtectAdminRoute>
            <AdminNavBar />
            <div className="d-flex flex-wrap justify-content-center">
                <div className="col-md-6 col-10">
                    <label htmlFor="minorCourse" className="form-label">Filter Using</label>
                    <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="categories"
                                value={choice}
                                label="Categories"
                                name="categories"
                                onChange={handleChoice}
                            >
                                {categories.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ minWidth: 120, marginBottom: "5vh" }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="choice"
                                value={selectedCourse}
                                label="Select"
                                name="choice"
                                onChange={handleChange}
                            >
                                {choicedata.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

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

                    {minorDetails.length === 2 && (
                        <div style={{ marginTop: "30px", marginBottom: "30px", fontWeight: "bold" }}>
                            Total Seats: {minorDetails[0]} <br />
                            Available Seats: {minorDetails[1]} <br />
                            Students Enrolled: {minorDetails[0] - minorDetails[1]}<br />
                        </div>
                    )}

                    {stud.length === 0 ? (
                        <div>No Students Enrolled</div>
                    ) : (
                        <div>
                            <div className='col-md mt-2 mb-2 '>
                                <Button variant="contained" sx={{ width: "100%" }} color="primary" onClick={downloadExcel}>
                                    Download Excel
                                </Button>
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                <table id="studentTable" className="table red">
                                    <thead>
                                        <tr className="red">
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Seat</th>
                                            <th scope="col">Member ID</th>
                                            <th scope="col">Mobile No.</th>
                                            <th scope="col">Program</th>
                                            <th scope="col">Language</th>
                                            <th scope="col">Prof. Course</th>
                                        </tr>
                                    </thead>
                                    <tbody>{tableEl}</tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectAdminRoute>
    );
};

export default DisplayMinorData;