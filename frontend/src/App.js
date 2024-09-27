import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserInfo from './pages/Dashboard'; // Assuming this is a protected page
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails'; // Add this import
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {/* Protected routes */}
          <Route
            path="/create-course"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/userInfo"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UserInfo />
              </PrivateRoute>
            }
          />
          <Route path="/course/:id" element={<CourseDetails />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
