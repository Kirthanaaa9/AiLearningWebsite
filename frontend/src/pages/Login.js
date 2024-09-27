import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { email, password } = formData;

  // Update form data state
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/login', formData); // Your backend URL
      const token = response.data.token;

      // Store the token and update authentication state
      if (token) {
        localStorage.setItem('token', token);
        setIsAuthenticated(true); // Update state in the parent component
        navigate('/userInfo'); // Navigate to the user info page after successful login
      }
    } catch (err) {
      setError('Login failed! Please check your credentials.');
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
