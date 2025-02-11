
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true }, // Common transaction ID for grouped orders
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // User placing the order
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Seller for the item
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }, // Single item in the order
  hashedOtp: { type: String, required: true }, // Hashed OTP for order verification
  amount: { type: Number, required: true }, // Total amount for this item
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  }, // Order status
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
