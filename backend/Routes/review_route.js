const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review'); // Import the Review model
const User = require('../models/user'); // Assuming you have a User model
const Item = require('../models/item'); // Assuming you have an Item model
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); 

// Get reviews using seller's email
router.get('/seller-reviews/:email',authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;

    // Find the seller by email and get the ID
    const seller = await User.findOne({ email }).select('_id');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Fetch reviews for the found seller ID and populate buyer & item details
    const reviews = await Review.find({ sellerId: seller._id })
      .populate({
        path: 'buyerId',
        select: 'firstName lastName' // Fetch buyer's first and last name
      })
      .populate({
        path: 'itemId',
        select: 'name' // Fetch item name
      });

    // Transform the response to include formatted names
    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      buyerName: review.buyerId ? `${review.buyerId.firstName} ${review.buyerId.lastName}` : 'Unknown Buyer',
      itemName: review.itemId ? `${review.itemId.name} `: 'Unknown Item',
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// GET route to fetch review for a specific item and buyer from the seller
router.get('/reviews/:itemId/:buyerEmail/:sellerId', authenticateToken,async (req, res) => {
    try {
      const { itemId, buyerEmail, sellerId } = req.params;
  
      // Find the buyerId based on the email
      const buyer = await User.findOne({ email: buyerEmail });
      if (!buyer) {
        return res.status(400).json({ message: 'Buyer not found.' });
      }
  
      const buyerId = buyer._id;
  
      // Check if the review exists for the specific itemId, buyerId, and sellerId
      const review = await Review.findOne({ itemId, buyerId, sellerId });
  
      if (!review) {
        return res.status(200).json({ review: null }); // If no review exists, return null
      }
  
      // If review exists, return the review data
      res.status(200).json({ review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching review.' });
    }
  });

  

// Submit a review for a seller/item by a buyer
router.post('/reviews',authenticateToken, async (req, res) => {
    try {
      const { sellerId, itemId, buyerEmail, rating, comment } = req.body;
  
      // Check if the buyer exists in the User collection using the email
      const buyer = await User.findOne({ email: buyerEmail });
      if (!buyer) {
        return res.status(400).json({ message: 'Buyer not found.' });
      }
  
      // Get the buyerId (ObjectId)
      const buyerId = buyer._id;
  
      // Check if the review already exists (a buyer can only review once per item/seller)
      const existingReview = await Review.findOne({ sellerId, buyerId, itemId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this item.' });
      }
  
      // Create a new review
      const review = new Review({
        sellerId,
        itemId,      // Store the itemId
        buyerId,     // Store the buyer's ObjectId
        rating,
        comment,
      });
  
      await review.save();
      res.status(201).json({ success: true, message: 'Review submitted successfully!', buyerId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting review.' });
    }
  });
  
  
module.exports = router;
