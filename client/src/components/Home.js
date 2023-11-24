import React from 'react';
import './Home.css'; //Importing css file

const Home = () => {
  return (
    
    <div className="home-container">
      <div className="canvas-container">
        {/* Image background */}
        <img
          src="/space.jpg"
          alt="Background"
          className="background-image"
        />
      </div>
      <div className="content-container">
        <h1 className="home-title">Welcome to StudentVerse</h1>
      </div>
    </div>
  );
};

export default Home;
