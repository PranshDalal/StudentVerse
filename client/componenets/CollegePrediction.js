import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Importing CSS File
import './CollegePrediction.css';

function CollegePrediction() {
//Setting variables for the data
  const [formData, setFormData] = useState({
    gpa: '',
    sat: '',
    act: '',
    extracurriculars: '',
  });
  const [recommendedCollege, setRecommendedCollege] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to delay the appearance of the form
    const timeout = setTimeout(() => {
      setIsFormVisible(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the student data to the server
      const response = await axios.post('http://127.0.0.1:5000/predict_college', {
        ...formData,
        name,
        email,
      });
      setRecommendedCollege(response.data.recommended_college);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={`App ${isFormVisible ? 'fade-in' : ''}`}>
      <form className={`college-form ${isFormVisible ? 'fade-in' : ''}`} onSubmit={handleSubmit}>
        <label>
          Student Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Your Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          GPA:
          <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
        </label>
        <label>
          SAT Score:
          <input type="text" name="sat" value={formData.sat} onChange={handleChange} />
        </label>
        <label>
          ACT Score:
          <input type="text" name="act" value={formData.act} onChange={handleChange} />
        </label>
        <label>
          Extracurriculars:
          <input type="text" name="extracurriculars" value={formData.extracurriculars} onChange={handleChange} />
        </label>
        <button type="submit">Get Recommendation</button>
      </form>
      {recommendedCollege && (
        <div className="result-box">
          <p>Recommended College: {recommendedCollege}</p>
        </div>
      )}
      <img src="/space.jpg" alt="Space" className="space-image" />
    </div>
  );
}

export default CollegePrediction;
