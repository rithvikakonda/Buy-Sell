import React from 'react';
import { Navigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Check if token exists and is valid
  if (!token) {
    return <Navigate to="/login-signup" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem('token');
      return <Navigate to="/login-signup" />;
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem('token');
    return <Navigate to="/login-signup" />;
  }

  // If token is valid, render the child components
  return children;
};

export default ProtectedRoute;
