
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './First.css';

const First = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    if (email && token) {
      // If email exists, redirect to the /search page
      navigate('/profile');
    } else {
      // If email does not exist, redirect to login-signup
      navigate('/login-signup');
    }
  };

  return (
    <div className="first">
      <div className="first-left">
        <h2>WELCOME</h2>
        <h3>BUY-SELL</h3>
      </div>
      <div className="first-right">
        <button className="start-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default First;
