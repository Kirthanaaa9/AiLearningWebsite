import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EnrolledCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Fetch the enrolled course details
    axios.get(`/enrolled/${courseId}`)
      .then(response => {
        setCourse(response.data);
      })
      .catch(error => {
        console.error('Error fetching enrolled course data', error);
      });
  }, [courseId]);

  const markCompleted = (chapterIndex) => {
    // Mark chapter as completed
    axios.post(`/mark-complete/${courseId}/${chapterIndex}`)
      .then(response => {
        setCourse(response.data); // Update course data with completion status
      })
      .catch(error => {
        console.error('Error marking chapter as complete', error);
      });
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <ul>
        {course.content.map((chapter, index) => (
          <li key={index}>
            {chapter.title} - {chapter.completed ? 'Completed' : 'Not Completed'}
            {!chapter.completed && (
              <button onClick={() => markCompleted(index)}>Mark as Completed</button>
            )}
            <video controls>
              <source src={`/videos/${chapter.title}.mp4`} type="video/mp4" />
            </video>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnrolledCourse;
