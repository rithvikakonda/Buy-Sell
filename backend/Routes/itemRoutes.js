const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // Adjust the path if needed
const User =   require('../models/user'); 

const authenticateToken = require('../middleware/authenticateToken'); // Middleware to verify user is logged in


router.get('/add_items',authenticateToken, (req, res) => {
  res.send('add items page');
});


router.post('/add_items',authenticateToken, async (req, res) => {
  try {
      const { name, price, description, category, email } = req.body;
      // console.log(req.body);

      // Check if required fields are provided
      if (!name || !price || !description || !category || !email) {
          return res.status(400).json({ message: 'All fields are required, including email' });
      }

      // Fetch the user by email
      const user = await User.findOne({ email });
      // const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Create a new item and associate it with the user's _id
      const newItem = new Item({
          name,
          price,
          description,
          category,
          seller: user._id, // Use the user's ID fetched from the User model
      });

      // Save the new item to the database
      await newItem.save();

      res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// module.exports = router;


// Get all items
router.get('/api/items',authenticateToken, async (req, res) => {
  try {
    // const items = await Item.find();
    const items = await Item.find().populate('seller', 'firstName lastName');
    // res.json(items);

    // console.log(items);
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get an item by ID
router.get('/api/items/:id', authenticateToken,async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Backend route to update item availability
router.patch('/api/items/:id/updateAvailability', authenticateToken,async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  try {
    await Item.findByIdAndUpdate(id, { isAvailable });
    res.status(200).json({ message: 'Item availability updated successfully' });
  } catch (error) {
    console.error('Error updating item availability:', error);
    res.status(500).json({ message: 'Failed to update item availability' });
  }
});



// Fetch user's cart items with item names
router.get('/cart-items', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart', 'name'); // Populate item names

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

module.exports = router;
