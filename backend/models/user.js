


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true, 
    trim: true },
  lastName: { 
    type: String, 
    required: true, 
    trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // match: /^[a-zA-Z0-9._%+-]+@(students\.iiit\.ac\.in|research\.iiit\.ac\.in|iiit\.ac\.in)$/,
    // match: /^[a-zA-Z0-9._%+-]+@(students\.iiit\.ac\.in|research\.iiit\.ac\.in|iiit\.ac\.in)$/,
    // match: /^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/,
  },
  age: { type: Number, required: true, min: 1 },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/, 
  },
  password: { type: String, required: true },  // Hashed password

  cart: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' }],  // References to items in cart

  sellerReviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' }],  // Reviews for the user
}, { timestamps: true });



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;


// module.exports = mongoose.model('User', userSchema);
