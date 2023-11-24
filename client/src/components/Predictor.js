import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Importing CSS file
import './Predictor.css';

const Predictor = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gpa, setGpa] = useState('');
  const [tardies, setTardies] = useState('');
  const [absences, setAbsences] = useState('');
  const [emotionalBehavior, setEmotionalBehavior] = useState('');
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Add a delay to ensure that the form is visible
    const delay = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(delay);
  }, []); // Run only on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST request to make the prediction
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        name,
        email,
        gpa: parseFloat(gpa),
        tardies: parseInt(tardies),
        absences: parseInt(absences),
        emotionalBehavior,
      });

      if ('prediction' in response.data) {
        setPrediction(response.data.prediction);
      } else {
        setPrediction(response.data.probability_of_positive_class);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  // Form that user will fill out
  return (
    <div className={`predictor-container ${fadeIn ? 'fade-in' : ''}`}>
      <img
        src="/space.jpg"
        alt="Background"
        className="background-image"
      />
      <form onSubmit={handleSubmit} className={`form ${fadeIn ? 'fade-in' : ''}`}>
        <label>
          Student Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Your Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
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
        <button type="submit" className="predictor-button">
          Predict
        </button>
      </form>
      {/* Displaying the prediction*/}
      {prediction && (
        <div className={`prediction-result ${fadeIn ? 'fade-in' : ''}`}>
          <h2>Prediction:</h2>
          {typeof prediction === 'string' ? (
            <p className="prediction-text">{prediction}</p>
          ) : (
            <p className="prediction-text">
              The probability of the student dropping out is{' '}
              {Math.round(prediction * 100)}%.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Predictor;
