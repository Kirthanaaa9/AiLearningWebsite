import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // Make sure the token exists
        if (!token) {
          throw new Error('No token found');
        }

        // Make a GET request to the /user endpoint, with the token in the Authorization header
        const response = await axios.get('http://localhost:5001/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the user data
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user info. Please log in again.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error ? <p>{error}</p> : <p>Welcome, {user ? user.role : 'Loading...'}</p>}
    </div>
  );
};

export default Dashboard;
