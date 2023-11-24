import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

//Importing all the components
import Home from './components/Home';
import ClassPage from './components/ClassPage';
import Predictor from './components/Predictor';
import AboutPage from './components/AboutPage';
import CollegePrediction from './components/CollegePrediction';
import CollegeData from './components/CollegeData';

//Importing CSS file
import './App.css';

//Creating navbar using Router
function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/AboutPage" activeClassName="active">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/class" activeClassName="active">
                Dropout Data
              </NavLink>
            </li>
            <li>
              <NavLink to="/CollegeData" activeClassName="active">
                College Data
              </NavLink>
            </li>
            <li>
              <NavLink to="/predictor" activeClassName="active">
                Dropout Predictor
              </NavLink>
            </li>
            <li>
              <NavLink to="/CollegePrediction" activeClassName="active">
                College Predictor
              </NavLink>
            </li>
          </ul>
        </nav>

        {/*Setting Routes */}
        <Routes>
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/class" element={<ClassPage />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/" element={<Home />} />
          <Route path="/CollegePrediction" element={<CollegePrediction />} />
          <Route path="/CollegeData" element={<CollegeData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
