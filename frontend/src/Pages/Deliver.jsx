
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliverItems.css';

import { useNavigate } from 'react-router-dom'; 

const DeliverItems = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [otpValues, setOtpValues] = useState({}); // Store OTPs for each order separately
  const [errorMessages, setErrorMessages] = useState({}); // Store error messages for each order
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const email = localStorage.getItem('userEmail'); 
        const token = localStorage.getItem('token');
        // Retrieve email from local storage
        if (!email) {
          console.error('User email not found in local storage.');
          return;
        }

        // Send the email as a query parameter
        const response = await axios.get(`http://localhost:5000/pending-delivery?email=${email}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setPendingOrders(response.data.orders);
        } else {
          console.error('Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchPendingOrders();
  }, []);

  // Handle OTP input change for each order
  const handleOtpChange = (event, orderId) => {
    const value = event.target.value;
    setOtpValues((prevOtpValues) => ({
      ...prevOtpValues,
      [orderId]: value,
    }));
  };
  const handleCloseTransaction = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [orderId]: 'Unauthorized. Please log in again.',
        }));
        return;
      }
  
      const enteredOtp = otpValues[orderId] || ''; // Get OTP for the current order
  
      const response = await axios.post('http://localhost:5000/close-transaction', {
        orderId,
        enteredOtp,
      },{
        headers: {  
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.data.success) {
        setPendingOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setErrorMessages((prevErrors) => {
          const { [orderId]: _, ...rest } = prevErrors; // Remove error for the successfully completed order
          return rest;
        });
      } else {
        // If the response doesn't indicate success, it means there's an issue with the OTP
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [orderId]: response.data.message || 'Transaction failed.', // Show the backend message here
        }));
      }
    } catch (error) {
      console.error('Error closing transaction:', error);
      
      // Handle specific error response from the backend
      if (error.response && error.response.data) {
        // If backend returned error message (e.g. Invalid OTP)
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [orderId]: error.response.data.message || 'An error occurred while closing the transaction.',
        }));
        // Set a timer to hide the error message after 1 second
      setTimeout(() => {
        setErrorMessages((prevErrors) => {
          const { [orderId]: _, ...rest } = prevErrors; // Remove the error message after 1 second
          return rest;
        });
      }, 1000);
      } else {
        // Generic error handling
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [orderId]: 'An unexpected error occurred.',
        }));
        // Set a timer to hide the error message after 1 second
      setTimeout(() => {
        setErrorMessages((prevErrors) => {
          const { [orderId]: _, ...rest } = prevErrors; // Remove the error message after 1 second
          return rest;
        });
      }, 1000);
      }
    }
  };
  



  // Navigate to AddItemPage
  const goToAddItemPage = () => {
    navigate('/add-item'); // Assumes /add-item is the route for AddItemPage
  };

  return (
    <div className="bb_body">
    <div className="deliver-items-container">
      <h2>Pending Orders for Delivery</h2>
      <div className="orders-list">
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div className="order-item" key={order._id}>
              <div className="order-item-details">
                <div className="item-name">{order.item.name}</div>
                <div className="item-price">Price: ₹{order.item.price}</div>
                <div className="buyer-name">
                  Buyer: {order.buyer.firstName} {order.buyer.lastName}
                </div>
              </div>
              <div className="otp-input">
                <label htmlFor={`otp-${order._id}`}>Enter OTP: </label>
                <input
                  type="text"
                  id={`otp-${order._id}`}
                  value={otpValues[order._id] || ''}
                  onChange={(event) => handleOtpChange(event, order._id)} // Handle change for each order
                />
                <button onClick={() => handleCloseTransaction(order._id)}>
                  Close Transaction
                </button>
                {errorMessages[order._id] && (
                  <div className="error-message">{errorMessages[order._id]}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders for delivery.</p>
        )}
      </div>
      <button className="add-item-button" onClick={goToAddItemPage}>
        Add New Item
      </button>
    </div>
    </div>
  );
};

export default DeliverItems;
