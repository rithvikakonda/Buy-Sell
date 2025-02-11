const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // For reCAPTCHA verification
const userModel = require('../models/user'); // Adjust path if needed

const router = express.Router();
require('dotenv').config();
// const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET; 



const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // Replace with your secret key

// Signup Route


router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, age, contactNumber, password, recaptchaToken } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !age || !contactNumber || !password || !recaptchaToken) {
    return res.status(400).json({ error: 'All fields and reCAPTCHA are required' });
  }

  // Verify reCAPTCHA
  try {
    const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Are you a bot?' });
    }
  } catch (error) {
    console.error('reCAPTCHA Verification Error:', error);
    return res.status(500).json({ error: 'reCAPTCHA verification error' });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!email || !password || !recaptchaToken) {
    return res.status(400).json({ error: 'Email, password, and reCAPTCHA are required' });
  }

  // Verify reCAPTCHA
  try {
    const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Are you a bot?' });
    }
  } catch (error) {
    console.error('reCAPTCHA Verification Error:', error);
    return res.status(500).json({ error: 'reCAPTCHA verification error' });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
