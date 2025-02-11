

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./penorders.css";
// import "./po.css";
const Pending_Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  let want_userId;

  const fetchPendingOrders = async () => {
    try {
      const email = localStorage.getItem("userEmail"); 
      // Retrieve email from localStorage
      const token = localStorage.getItem("token");
      console.log("Fetching pending orders for:", email);
      if (!email || !token) {
        console.error("User is not logged in.");
        return;
      }

      // Send the email to the backend to get the orders of the logged-in user
      const response = await axios.get("http://localhost:5000/pendingorders", {
        params: { email },
      
        headers: {
          Authorization: `Bearer ${token}`,
        },
     } );


      if (response.data.success) {
        // console.log("entereddd");
        want_userId = response.data.userId; // Get the userId from the backend response
        const ordersWithOtp = response.data.orders.map((order) => {
          const localStorageKey = `otp_${want_userId}_${order.item._id}`; // Construct the key
          const otp = localStorage.getItem(localStorageKey); // Retrieve OTP from localStorage
          return {
            ...order,
            otp: otp || "OTP not available", // Fallback if OTP is not found
          };
        });
        setPendingOrders(ordersWithOtp);
      } else {
        console.error("Failed to fetch pending orders.");
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const regenerateOtp = async (order) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:5000/regenerateotp", {
        transactionId: order.transactionId, // Use transactionId for lookup
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        const newOtp = response.data.newOtp;
        const localStorageKey = `otp_${response.data.userId}_${order.item._id}`;
        localStorage.setItem(localStorageKey, newOtp); // Update OTP in localStorage
        fetchPendingOrders(); // Refresh orders to show updated OTP
      } else {
        console.error("Failed to regenerate OTP.");
      }
    } catch (error) {
      console.error("Error regenerating OTP:", error);
    }
  };

  const showOtp = (order) => {
    // const userId = localStorage.getItem("userId");
    const localStorageKey = `otp_${want_userId}_${order.item._id}`;
    const otp = localStorage.getItem(localStorageKey);
    alert(`OTP for ${order.item.name}: ${otp}`);
  };

  useEffect(() => {
    fetchPendingOrders(); // Fetch pending orders when the component loads
  }, []);

  return (
    <div className="pending-orders-container">
      {/* <h2>Pending Orders</h2> */}
      <div className="orders-list">
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order, index) => (
            <div className="order-item" key={index}>
              <div className="order-item-details">
                <div className="item-name">{order.item.name}</div>
                <div className="item-price">Price: ₹{order.item.price}</div>
                <div className="seller-name">
                  Seller: {order.seller.firstName} {order.seller.lastName}
                </div>
                <div className="order-status">Status: {order.status}</div>
              </div>
              <div className="order-otp">
                <strong>OTP: </strong>
                <span>{order.otp}</span>
              </div>
              <div className="order-actions">
                {/* <button onClick={() => showOtp(order)}>Show OTP</button> */}
                <button onClick={() => regenerateOtp(order)}>
                  Regenerate OTP
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Pending_Orders;
