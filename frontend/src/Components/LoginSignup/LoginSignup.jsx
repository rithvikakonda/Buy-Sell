
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA
import './Login.css';

const Login_Signup = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(''); // Store reCAPTCHA token

  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage('');
    setError('');
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Store reCAPTCHA token
  };

  

  const handleEmailValidation = (e) => {
    const email = e.target.value;
  
    // Regular expression to validate a standard email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (emailRegex.test(email)) {
      setError('');  // Clear the error if the email format is valid
    } else {
      setError('Please enter a valid email address.');
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("ssjhbfnl");
    console.log(formData.email);

    // Email Validation (allowing any standard email)
    const email = formData.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return; // Stop the form submission if email is invalid
    }


    if (formType === 'signup') {
      const phonePattern = /^[6-9]\d{9}$/; // Valid 10-digit phone number starting with 6-9
      if (!phonePattern.test(formData.contactNumber)) {
        setError('Invalid contact number. It should be a 10-digit number starting with 6-9.');
        return; // Stop the form submission if phone number is invalid
      }
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA.');
      return;
    }

    const url = formType === 'signup' ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

    try {
      const response = await axios.post(url, { ...formData, recaptchaToken });

      if (response.status === 201 || response.status === 200) {
        setMessage(`Success! ${response.data.message}`);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', formData.email);

        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Request failed'}`);
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="login-signup">
      <form onSubmit={handleSubmit}>
        <h2>{formType === 'login' ? 'Login' : 'Sign Up'}</h2>
        {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
        {error && <p className="error">{error}</p>}

        {formType === 'signup' && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          // pattern=".+@iiit\.ac\.in"
          onChange={handleInputChange}
          onInvalid={handleEmailValidation}
          onInput={() => setError('')}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {/* Google reCAPTCHA */}
        <ReCAPTCHA sitekey="6LevU8sqAAAAAMcLjtzgf6Ukq3hfr-wxmNfcboOf" onChange={handleRecaptchaChange} />

        <button type="submit">{formType === 'login' ? 'Login' : 'Sign Up'}</button>
        <button type="button" className="toggle-button" onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}>
          {formType === 'login' ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
};

export default Login_Signup;
