import { useEffect, useState } from "react"
import { ProtectAdminRoute } from "../manageRoutes/ProtectRoutes";
import { Collapse } from "@mui/material"
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import AdminNavBar from "../compoents/AdminNavBar";
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#0275d8',
    },
    '& label': {
        color: "#0275d8"
    },
    '& input': {
        color: "black"
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#0275d8',
        color: "black"
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#0275d8',
        },
        '&:hover fieldset': {
            borderColor: '#0275d8',
            color: "black"
        },
        '&.Mui-focused fieldset': {
            borderColor: '#0275d8',
            color: "black"
        },
    },
});

const AptitudeResults = () => {

    const [results, setResults] = useState([])
    const [showAns, setShowAns] = useState(false)
    const [ansIndex, setAnsIndex] = useState({})
    const [selectType, setSelectType] = useState('')
    const [selectedArray, setSelectedArray] = useState([])
    const [selectedScore, setSelectedScore] = useState('')

    useEffect(() => {
        fetch(`http://localhost:7000/api_v1/get-all-results`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            response.json().then(r => {
                setResults(r)
            })
        }).catch(err => {
            return err.json()
        })
    }, [])

    // console.log(ansIndex?.appearedResults?.filter((q) => q.type === 'Databases')?.filter((r) => r.isCorrect).length)

    const prepareDisplayResult = (ansIndex, selectType) => {
        if (selectType !== '') {
            setSelectedArray(ansIndex?.appearedResults?.filter((q) => q.type === selectType))
            setSelectedScore(selectedArray.filter((r) => r.isCorrect).length)
        } else {
            setSelectedArray(ansIndex)
        }
    }

    const testData = [
        'Web Development',
        'Databases',
        'Analytical',
        'Programming'
    ]

    const handleChange = event => {
        setSelectType(event.target.value);
        // setSelectedScore(0)
    };

    return (
        <ProtectAdminRoute>
            <AdminNavBar />
            <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="col-10">
                    <Collapse in={!showAns}>
                        <div>
                            <table className="table text-dark">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Roll No</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Year</th>
                                        <th scope="col">Course</th>
                                        <th scope="col">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, i) => (
                                        <tr key={i}>
                                            <td>{r.fullName}</td>
                                            <td>{r.rollNo}</td>
                                            <td>{r.email}</td>
                                            <td>{r.year}</td>
                                            <td>{r.course}</td>
                                            <td>{r.score}</td>
                                            <td>
                                                <button onClick={() => {
                                                    setAnsIndex(r)
                                                    // prepareDisplayResult(r, selectType)
                                                    setSelectedArray(r.appearedResults)
                                                    setShowAns(true)
                                                }} className="btn btn-primary">
                                                    Show
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Collapse>
                    <Collapse in={showAns}>
                        <button onClick={() => setShowAns(false)} className="btn btn-outline-danger">
                            Close
                        </button>
                        <div>
                            { }
                            <div className="d-flex flex-wrap justify-content-evenly align-items-start">
                                {/* {JSON.stringify(ansIndex.fullName)} */}
                                <div className="col-md-6 col-12">
                                    <div>
                                        <h2>{ansIndex?.fullName}</h2>
                                        <h2>{ansIndex?.email}</h2>
                                        <h2>{ansIndex?.rollNo}</h2>
                                        <div className="card bg-transparent border-primary col-8 p-2">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <h3>Web Development Score:</h3> <h3>{ansIndex?.appearedResults?.filter((q) => q.type === 'Web Development')?.filter((r) => r.isCorrect).length}</h3>
                                            </div>
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <h3>Databases Score:</h3> <h3>{ansIndex?.appearedResults?.filter((q) => q.type === 'Databases')?.filter((r) => r.isCorrect).length}</h3>
                                            </div>
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <h3>Analytical Score:</h3> <h3>{ansIndex?.appearedResults?.filter((q) => q.type === 'Analytical')?.filter((r) => r.isCorrect).length}</h3>
                                            </div>
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <h3>Programming Score:</h3> <h3>{ansIndex?.appearedResults?.filter((q) => q.type === 'Programming')?.filter((r) => r.isCorrect).length}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className='d-flex col-12 container-fluid'>
                                        {/* <InputLabel id="demo-multiple-chip-label" style={{ color: "#0275d8" }}>Select type of user</InputLabel> */}
                                        <Select
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            style={{ width: '100%', color: "black" }}
                                            value={selectType}
                                            defaultValue='Student / Freelancer'
                                            onChange={handleChange}
                                            input={<OutlinedInput id="select-multiple-chip" label="" />}
                                        >
                                            {testData.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <button className="btn btn-primary col-3 mx-3" onClick={() => {
                                            prepareDisplayResult(ansIndex, selectType)
                                        }}>

                                            Filter
                                        </button>
                                    </div>
                                    {/* {JSON.stringify(ansIndex)}
                                        {JSON.stringify(selectedArray)} */}
                                    <div className="d-flex flex-wrap justify-content-center">
                                        {selectedArray?.map((q, i) => (
                                            <div key={i} className={selectedArray[i]?.isCorrect ? 'card border-primary bg-transparent col-md-10 col m-2 p-2' : 'card border-danger bg-transparent col-md-10 col m-2 p-2'}>
                                                <p>Type: {q.type}</p>
                                                <p className="">{q.question}</p>
                                                {q.isCode ? <div>
                                                    <pre><code>{q.codeContent}</code></pre>
                                                </div> : null}
                                                <div className="d-flex flex-wrap justify-content-around align-items-start">
                                                    <div>
                                                        <div className="py-1">
                                                            <b>Correct Option</b>
                                                        </div>
                                                        <div>
                                                            <span>{q.correctAnswer}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="py-1">
                                                            <b>Selected Option</b>
                                                        </div>
                                                        <div>{q.selectedAnswer === '' ? <span>No Answer Selected</span> : <span>{q.selectedAnswer}</span>}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        </ProtectAdminRoute>
    )
}

export default AptitudeResults