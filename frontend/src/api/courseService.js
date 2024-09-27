// src/api/courseService.js
import axios from 'axios';

export const createCourse = async (courseData) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  const config = {
    headers: {
      Authorization: token, // Send token in Authorization header
    },
  };

  try {
    const response = await axios.post('http://localhost:5001/course', courseData, config);
    return response.data;
  } catch (err) {
    console.error('Error creating course:', err);
    throw err;
  }
};
