import React, { useState } from 'react';
import { createCourse } from '../api/courseService';

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    content: [{ title: '', description: '', hours: 0 }],
  });

  // Handler for course details like title, description, instructor
  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  // Handler for content section changes
  const handleContentChange = (index, e) => {
    const newContent = [...courseData.content];
    newContent[index][e.target.name] = e.target.value;
    setCourseData({ ...courseData, content: newContent });
  };

  // Handler for adding more content sections
  const addContent = () => {
    setCourseData({
      ...courseData,
      content: [...courseData.content, { title: '', description: '', hours: 0 }],
    });
  };

  // Handler for removing a content section
  const removeContent = (index) => {
    const newContent = [...courseData.content];
    newContent.splice(index, 1);
    setCourseData({ ...courseData, content: newContent });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdCourse = await createCourse(courseData);
      console.log('Course created:', createdCourse);
    } catch (err) {
      console.error('Failed to create course');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={courseData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="description"
          placeholder="Course Description"
          value={courseData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="instructor"
          placeholder="Instructor Name"
          value={courseData.instructor}
          onChange={handleChange}
        />
      </div>

      <h3>Course Content</h3>
      {courseData.content.map((content, index) => (
        <div key={index}>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Content Title"
              value={content.title}
              onChange={(e) => handleContentChange(index, e)}
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Content Description"
              value={content.description}
              onChange={(e) => handleContentChange(index, e)}
            />
          </div>
          <div>
            <input
              type="number"
              name="hours"
              placeholder="Hours"
              value={content.hours}
              onChange={(e) => handleContentChange(index, e)}
            />
          </div>
          <button type="button" onClick={() => removeContent(index)}>
            Remove Content Section
          </button>
        </div>
      ))}

      <button type="button" onClick={addContent}>
        Add Content Section
      </button>
      <button type="submit">Create Course</button>
    </form>
  );
};

export default CreateCourse;
