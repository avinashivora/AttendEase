import React, { useState ,useEffect} from 'react';
import { createIssue,getAllIssues } from '../actions/issueActions';

const Issues = () => {

  const [issues,setIssues] = useState([])
  const [refresh,setRefresh] = useState(false)
  useEffect(()=>{
    const fetchIssues = async()=>{
      const response = await getAllIssues()
      setIssues(response.issues)
    }
    fetchIssues()
  },[refresh])

  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await createIssue({subject : formData.subject,description : formData.description})
    setRefresh(p => !p)
    setFormData({
      subject: '',
      description: ''
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const issuesElements = issues.map((issue)=> (

  // ))

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            placeholder="Enter subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            placeholder="Enter description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>


        <button className="btn btn-primary">
          Submit
        </button>
      </form>
      <hr />
      {JSON.stringify(issues)}
    </div>
  );
};

export default Issues;
