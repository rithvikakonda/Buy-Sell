// const port = 5000;
const port = process.env.PORT || 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require('bcrypt');
const cors =require("cors");
const axios = require('axios');


const authenticateToken = require('./middleware/authenticateToken'); 
//models

const userModel = require ('./models/user');
// const reviewModel = require ('./models/review');

const itemModel = require ('./models/item');
const orderModel = require ('./models/order');
const reviewModel = require ('./models/review');

const itemRoutes = require('./Routes/itemRoutes'); // Import the item routes
const cart = require('./Routes/cart'); // Import the item routes
const orderRoutes = require('./Routes/order_route');
const reviewRoutes = require('./Routes/review_route');
const loginRoutes = require('./Routes/login');

// const authenticateToken = require('./middleware/authenticateToken'); // Middleware for authentication


app.use(express.json());
app.use(cors());

require('dotenv').config();
// const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
// mongoose.connect('mongodb://127.0.0.1:27017/users', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => console.log('Connected to MongoDB'));

//Api creation
app.use(itemRoutes);
app.use(cart);
app.use(orderRoutes);
app.use(reviewRoutes);
app.use(loginRoutes);
// Use the item routes




// Route to fetch profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Find user by ID (from the decoded JWT payload)
    const user = await userModel.findById(req.user.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update profile
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNumber } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id, // Assuming `req.user` contains the authenticated user's ID
      { firstName, lastName, email, age, contactNumber },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


app.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});



app.post("/chat", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging

    // Ensure contents exist and extract the message
    const contents = req.body.contents;
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const userMessage = contents[0].parts[0]; // Extract message from request

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Simulating AI response (Replace with actual API call)
    const botResponse = `You said: ${userMessage}`;

    res.json({ reply: botResponse });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port,(err)=>{
    if(!err){
        console.log("Server Running on Port :" +port);
    }
    else{
        console.log("Erreor:" +err);
    }
});

