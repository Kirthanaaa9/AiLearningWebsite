import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams(); // Get courseId from route params
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch course details by ID
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/courses/${id}`);
        setCourse(response.data); // Store course details in state
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token'); // Get token from local storage

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      // Enroll the user in the course
      await axios.post(`http://localhost:5001/enroll/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // After enrolling, redirect to the enrolled course page
      navigate(`/enrolled/${id}`);
    } catch (error) {
      console.error('Error enrolling in course', error);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <h2>Chapters</h2>
      <ul>
        {course.content.map((chapter, index) => (
          <li key={index}>{chapter.title}</li>
        ))}
      </ul>
      <button onClick={handleEnroll}>Enroll</button>
    </div>
  );
};

export default CourseDetails;
