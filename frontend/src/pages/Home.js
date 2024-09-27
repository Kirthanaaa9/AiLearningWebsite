import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Include a CSS file for styling

const Home = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Fetch courses from backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/courses');
        setCourses(response.data); // Store courses in state
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Handle click to navigate to course details page
  const handleClick = (courseId) => {
    navigate(`/course/${courseId}`); // Navigate to the course details page
  };

  return (
    <div className="container">
      <h1>Available Courses</h1>
      <div className="course-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course._id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <button onClick={() => handleClick(course._id)}>View Details</button> {/* Pass course ID */}
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
