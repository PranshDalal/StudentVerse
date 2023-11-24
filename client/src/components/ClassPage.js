import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClassPage.css'; // Importing css file

const ClassPage = () => {
  const [students, setStudents] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  // Map prediction to descriptive labels
  const mapPrediction = (value) => {
    const predictionMap = {
      1: 'Drop Out',
      0: 'Will Not Drop Out',
    };

    return predictionMap[value] || value;
  };

  // Map numeric emotional behavior to descriptive labels
  const mapEmotionalBehavior = (value) => {
    // Replace this mapping with your actual labels
    const emotionalBehaviorMap = {
      0: 'Poor',
      1: 'Fair',
      2: 'Good',
      3: 'Excellent',
    };

    return emotionalBehaviorMap[value] || value;
  };

  // Fetching data from previous data route in server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/view_previous_data');

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
            <th>Tardies</th>
            <th>Absences</th>
            <th>Emotional Behavior</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping data */}
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.gpa}</td>
              <td>{student.tardies}</td>
              <td>{student.absences}</td>
              <td>{mapEmotionalBehavior(student.emotional_behavior)}</td>
              <td>{mapPrediction(student.prediction)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassPage;
