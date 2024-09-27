import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/register', formData);
      alert(response.data.msg);
      setFormData({ name: '', email: '', password: '', role: 'student' }); // Clear form on success
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed!'); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <select
            name="role"
            value={role}
            onChange={onChange}
            className="form-control"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
