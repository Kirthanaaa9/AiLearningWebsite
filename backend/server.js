const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assuming you have a User model
const Course = require('./models/Course'); // Assuming you have a Course model
const { ObjectId } = mongoose.Types; // Destructure ObjectId from mongoose

const app = express();
const JWT_SECRET = 'ASRK6203'; // Specify the JWT secret key directly

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Database connection
mongoose.connect('mongodb://localhost:27017/learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('DB connection error:', err));

// Routes

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } }; // Set user.id in the payload
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Define the /user route
app.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create course
app.post('/course', async (req, res) => {
  try {
    const { title, description, instructor, content } = req.body;

    const newCourse = new Course({
      title,
      description,
      instructor,
      content,
      createdAt: new Date()
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
});

// Fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Enroll
app.post('/enroll/:courseId', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = user.enrolledCourses.some(enrolled => enrolled.courseId.equals(course._id));
    if (isEnrolled) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    user.enrolledCourses.push({
      courseId: course._id,
      title: course.title,
      completed: false
    });

    await user.save();

    res.status(200).json({
      message: `User successfully enrolled in course ${course.title}`,
      enrolledCourses: user.enrolledCourses
    });
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    res.status(500).json({ message: 'Error enrolling user in course', error });
  }
});

// Fetch course by ID
app.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ msg: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Powered Learning Platform API');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
