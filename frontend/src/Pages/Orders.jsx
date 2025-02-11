

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./orders.css";
import Pending_Orders from '../Components/Orders/Pendingorders';
import Bought_Orders from '../Components/Orders/Boughtorders';
import Sold_items from '../Components/Orders/SoldItems';
import { useNavigate } from "react-router-dom";
// /home/konda-rithvika/app/Frontend/src/Components/orders/pendingorders.jsX

const OrdersHistory = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!token || !email) {
      console.error("Unauthorized access. Redirecting to login...");
      navigate("/login-signup"); // Redirect to login page
      return;
    }
    // Fetch data for bought and sold items
    const fetchOrders = async () => {
      try {
        
        const response = await axios.get("http://localhost:5000/api/orders/history",{
          headers: {
            Authorization: `Bearer ${token}`,
        }
        });
        if (response.data.success) {
          setBoughtItems(response.data.boughtItems || []);
          setSoldItems(response.data.soldItems || []);
        } else {
          console.error("Failed to fetch orders history.");
        }
      } catch (error) {
        console.error("Error fetching orders history:", error);
      }
    };

    fetchOrders();
  }, [navigate]);

  const renderBoughtItems = () =>
    boughtItems.length > 0 ? (
      <ul>
        {boughtItems.map((item) => (
          <li key={item._id}>
            <div>Item: {item.itemName}</div>
            <div>Price: ${item.amount}</div>
            <div>Purchase Date: {new Date(item.date).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No items bought.</p>
    );

  const renderSoldItems = () =>
    soldItems.length > 0 ? (
      <ul>
        {soldItems.map((item) => (
          <li key={item._id}>
            <div>Item: {item.itemName}</div>
            <div>Price: ${item.amount}</div>
            <div>Sold Date: {new Date(item.date).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No items sold.</p>
    );

  return (
    <div className="orders-page">
    <div className="orders-history">
      {/* <h2>Orders History</h2> */}
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders
        </button>
        <button
          className={activeTab === "bought" ? "active" : ""}
          onClick={() => setActiveTab("bought")}
        >
          Bought Items
        </button>
        <button
          className={activeTab === "sold" ? "active" : ""}
          onClick={() => setActiveTab("sold")}
        >
          Sold Items
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "pending" && <Pending_Orders />}
        {activeTab === "bought" && <Bought_Orders/>}
        {activeTab === "sold" && <Sold_items/>}
      </div>
    </div>
    </div>
  );
};

export default OrdersHistory;
