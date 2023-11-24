import React from 'react';
import './AboutPage.css'; //Importing CSS file

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="canvas-container">
        {/*Background Image */}
        <img
          src="/space.jpg" 
          alt="Background"
          className="background-image"
        />
      </div>
      <div className="content-container">
        <h1 className="about-title">About StudentVerse</h1>
        <p className="about-description">
          StudentVerse is a platform dedicated to empowering students and educators
          by providing tools and insights to enhance the learning experience.
          Our mission is to create a supportive and engaging environment for
          educational success.
        </p>
        
        {/* Images of 3 students as rectangles with rounded corners */}
        <div className="student-images-container">
          <img
            src="/student1.jpg"
            alt="Student 1"
            className="student-image"
            style={{ width: '220px', height: '180px', borderRadius: '30px' }}
          />
          <img
            src="/student2.jpg" 
            alt="Student 2"
            className="student-image"
            style={{ width: '220px', height: '180px', borderRadius: '30px' }}
          />
          <img
            src="/student3.jpg" 
            alt="Student 3"
            className="student-image"
            style={{ width: '220px', height: '180px', borderRadius: '30px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
