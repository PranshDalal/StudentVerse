import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CollegeData.css'; // Importing CSS file

const CollegeData = () => {
  const [students, setStudents] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  // Fetching data from the previous data route in the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://studentverse.onrender.com/view_previous_data_college');

        if (Array.isArray(response.data)) {
          setStudents(response.data);
          setFadeIn(true);
        } else {
          console.error('Invalid data format received from the server:', response.data);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`page-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className="canvas-container">
        {/* Background Image */}
        <img src="/space.jpg" alt="Background" className="background-image" />
      </div>
      {/* Fadein Animation */}
      <h1 className={`page-title ${fadeIn ? 'fade-in' : ''}`}>Class Page</h1>
      <table className={`class-table ${fadeIn ? 'fade-in' : ''}`}>
        <thead>
          <tr>
            <th>Name</th>
            <th>GPA</th>
            <th>SAT Score</th>
            <th>ACT Score</th>
            <th>Extracurriculars</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping data */}
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.gpa}</td>
              <td>{student.sat}</td>
              <td>{student.act}</td>
              <td>{student.extracurriculars}</td>
              <td>{student.recommended_college}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeData;
