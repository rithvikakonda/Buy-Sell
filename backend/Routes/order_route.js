
// module.exports = router;
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user'); // Import the User model
const Item = require('../models/item'); // Import the Item model
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authenticateToken'); 
// OTP generation function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};


router.post('/placeOrder', authenticateToken,async (req, res) => {
  try {
    const { email, items } = req.body; // Expecting buyer's email and items array
    // console.log(`Buyer email: ${email}`);
    const buyer = await User.findOne({ email }); // Find buyer by email

    if (!buyer) {
      console.log("Buyer not found!");
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const orders = [];
    const otpMapping = []; // To store actual OTPs for frontend use

    for (const item of items) {
      // const { v4: uuidv4 } = require('uuid');
      const transactionId = 'TXN' + Date.now();
      // const transactionId = 'TXN-' + uuidv4();
      // const transactionId = 'TXN' + Date.now();

      // Find item details
      const itemData = await Item.findById(item._id);
      if (!itemData) {
        console.log("Item not found!");
        return res.status(404).json({ error: `Item not found with ID ${item._id}` });
      }

      // Find seller details
      const seller = await User.findById(itemData.seller._id);
      if (!seller) {
        console.log("Seller not found!");
        return res.status(404).json({ error: `Seller not found for item ${itemData.name}` });
      }

      const otp = generateOTP(); // Generate OTP for the item
      const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP for secure storage

      // Create a new order for each item
      const order = new Order({
        transactionId,
        buyer: buyer._id,
        seller: seller._id,
        item: item._id,
        hashedOtp,
        amount: item.price,
        status: 'pending',
      });

      orders.push(order);
      otpMapping.push({ _id: item._id, otp });
      // otpMapping[item._id] = otp; // Map item ID to actual OTP for frontend
      // console.log(`Generated OTP for item ${itemData.name}: ${otp}`);
    }

    // Insert all orders into the database
    await Order.insertMany(orders);

    res.json({ success: true, orders, otps: otpMapping,userId: buyer._id  }); // Return orders and OTP mapping
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: 'An error occurred while placing the order.' });
  }
});

// router.get('/pendingorders', (req, res) => {
//   res.send('pendingorders');
// });

router.get('/pendingorders',authenticateToken, async (req, res) => {
  try {
    const { email } = req.query;  // Get the email from the request query params
    // console.log("aaaaaaaaaaaa");
    // console.log(email);
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Find user by email to get their buyerid (assuming User schema has email field)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    // console.log("found user!!")
    // Fetch pending orders where the buyerid matches the user and status is 'pending'
    const orders = await Order.find({
      buyer: user._id,
      status: 'pending',
    }).populate('item').populate('seller','firstName lastName');  // Assuming `item` and `seller` are references
    // const items = await Item.find().populate('seller', 'firstName lastName');
    if (orders.length === 0) {
      // console.log("no items");
      return res.status(404).json({ success: false, message: 'No pending orders found.' });
    }

    res.json({ success: true, orders ,userId:user._id });///here also add userid
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching orders.' });
  }
});


router.get('/pending-delivery',authenticateToken, async (req, res) => {
  try {
    const email = req.query.email; // Retrieve email from query parameters
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch pending orders for the seller
    const orders = await Order.find({
      seller: user._id, // Use user._id for seller ID
      status: 'pending',
    })
      .populate('item')
      .populate('buyer', 'firstName lastName'); // Populate buyer's name

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});
// Route to verify OTP and close transaction
router.post('/close-transaction',authenticateToken, async (req, res) => {
  const { orderId, enteredOtp } = req.body;
  
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      // console.log("qqqqqqqqqqqqq");
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    
    // Verify OTP (hash comparison assumed)
    const isOtpValid = await bcrypt.compare(enteredOtp, order.hashedOtp);
    console.log(isOtpValid);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Close the transaction
    order.status = 'completed';
    await order.save();
    
    res.json({ success: true, message: 'Transaction completed successfully.' });
  } catch (error) {
    console.error('Error closing transaction:', error);
    res.status(500).json({ success: false, message: 'Failed to close transaction.' });
  }
});

// Route to fetch bought items
router.get('/orders_bought/:email',authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;

    // Find buyer by email
    const buyer = await User.findOne({ email });
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    // Fetch orders where buyer matches and status is completed
    const boughtItems = await Order.find({
      buyer: buyer._id,
      status: "completed",
    })
      .populate("item", "name price")
      .populate("seller", "firstName lastName");

    res.json({ success: true, boughtItems });
  } catch (error) {
    console.error("Error fetching bought items:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bought items." });
  }
});

// Route to fetch sold items
router.get('/orders_sold/:email', authenticateToken,async (req, res) => {
  try {
    const { email } = req.params;

    // Find seller by email
    const seller = await User.findOne({ email });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    // Fetch orders where seller matches and status is completed
    const soldItems = await Order.find({
      seller: seller._id,
      status: "completed",
    })
      .populate("item", "name price")
      .populate("buyer", "firstName lastName");

    res.json({ success: true, soldItems });
  } catch (error) {
    console.error("Error fetching sold items:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sold items." });
  }
});

router.post("/regenerateotp",authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.body;

    // Find all orders with the given transactionId
    const orders = await Order.find({ transactionId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this transaction ID" });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Hash the OTP using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedOtp = await bcrypt.hash(newOtp, saltRounds);

    // Update all orders with the new hashed OTP
    for (const order of orders) {
      order.hashedOtp = hashedOtp;
      await order.save();
    }

    // Return the new OTP to the frontend
    res.status(200).json({ success: true, newOtp, userId: orders[0].buyer.toString() });
  } catch (error) {
    console.error("Error regenerating OTP:", error);
    res.status(500).json({ success: false, message: "Failed to regenerate OTP" });
  }
});

// module.exports = router;
// 

module.exports = router;
