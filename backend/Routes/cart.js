
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // User model
const Item = require('../models/item'); // Item model
// const authenticateToken = require('../middleware/authMiddleware'); // Import the authentication middleware
const authenticateToken = require('../middleware/authenticateToken'); 

// Add item to cart route
router.post('/cart/add',authenticateToken, async (req, res) => {
  const { email, itemId } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the item already exists in the cart
    if (user.cart.includes(itemId)) {
      return res.status(400).json({ message: 'Item already in cart.' });
    }

    // Add item to the user's cart
    user.cart.push(itemId);
    await user.save();

    res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.post('/cart',authenticateToken, async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).populate({
      path: 'cart',
      populate: { path: 'seller', model: 'User' }, // Populate seller details within cart items
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// module.exports = router;
router.post('/cart/remove',authenticateToken, async (req, res) => {
  const { email, itemId } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Remove the item from the user's cart
    const itemIndex = user.cart.indexOf(itemId);
    if (itemIndex > -1) {
      user.cart.splice(itemIndex, 1); // Remove the item
      await user.save();
      return res.status(200).json({ message: 'Item removed from cart successfully.' });
    }

    res.status(400).json({ message: 'Item not found in cart.' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/cart/clear', authenticateToken,async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = []; // Clear the user's cart
    await user.save(); // Save the updated user document

    res.json({ message: 'Cart cleared successfully.' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'An error occurred while clearing the cart.' });
  }
});
// Test route (optional, can be removed later)
router.get('/cart/add', (req, res) => {
  res.send('Cart add page');
});

router.get('/cart', (req, res) => {
  res.send('Cart page');
});

module.exports = router;
