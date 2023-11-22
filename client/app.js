import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [gpa, setGpa] = useState('');
  const [tardies, setTardies] = useState('');
  const [absences, setAbsences] = useState('');
  const [emotionalBehavior, setEmotionalBehavior] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        gpa: parseFloat(gpa),
        tardies: parseInt(tardies),
        absences: parseInt(absences),
        emotionalBehavior,
      });

      if ('prediction' in response.data) {
        setPrediction(response.data.prediction);
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  return (
    <div className="App">
      <h1>Student Dropout Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          GPA (0-4 scale):
          <input
            type="number"
            step="0.1"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Number of Tardies:
          <input
            type="number"
            value={tardies}
            onChange={(e) => setTardies(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Number of Absences:
          <input
            type="number"
            value={absences}
            onChange={(e) => setAbsences(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Emotional Behavior:
          <select
            value={emotionalBehavior}
            onChange={(e) => setEmotionalBehavior(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </label>
        <br />
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <div>
          <h2>Prediction:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
