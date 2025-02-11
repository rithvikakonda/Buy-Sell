
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '', // Add confirmPassword to verify new password
  });
  const [message, setMessage] = useState('');
  const [showReviews, setShowReviews] = useState(false); // State for toggling reviews visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in');
        return navigate('/login-signup');
      }
      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          age: response.data.age,
          contactNumber: response.data.contactNumber,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '', // Initialize confirmPassword
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Error fetching profile');
      }
    };

    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/cart-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchProfile();
    fetchCartItems();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setMessage('Invalid contact number. Must be a 10-digit number starting with 6-9.');
      return;
    }
    
    try {
      const response = await axios.put('http://localhost:5000/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setEditMode(false);
      setUser(response.data.user);
      setTimeout(() => setMessage(''), 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 1200);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/change-password',
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
      setPasswordChangeMode(false); // Hide the password change form after successful change
      setFormData({ ...formData, oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password');
    }
  };

  const fetchReviews = async () => {
    if (!user) return;
  
    try {
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/seller-reviews/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div className="b_body">
      <div className="profile-container">
        {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
        {user ? (
          <div className="profile-details">
            <h2 className="profile-header">PROFILE</h2>
            {editMode ? (
              <form onSubmit={handleEditProfile} className="edit-form">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="First Name" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Last Name" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled />
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required placeholder="Age" />
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required placeholder="Contact Number" />
                <button type="submit" className="update-button">Update Profile</button>
              </form>
            ) : (
              <div>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Contact Number:</strong> {user.contactNumber}</p>
                <button onClick={() => setEditMode(true)} className="edit-button">Edit Profile</button>
              </div>
            )}

            <button onClick={() => setPasswordChangeMode(true)} className="change-password-button">Change Password</button>

            {passwordChangeMode && (
              <form onSubmit={handlePasswordChange} className="change-password-form">
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Old Password"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                  required
                />
                <button type="submit" className="update-button">UPDATE</button>
              </form>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="cart-container">
      <h2>Cart Items</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <p><strong>Item:</strong> {item.name}</p>
           
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
      

      <button onClick={() => { setShowReviews(!showReviews); fetchReviews(); }} className="reviews-button">
        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
      </button>

      {showReviews && (
        <div className="reviews-container">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <p><strong>Buyer:</strong> {review.buyerName}</p>
                <p><strong>Comment:</strong> {review.comment}</p>
                <p><strong>Rating:</strong> {review.rating} / 5</p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
