import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SoldItems.css"; // Add custom CSS for styling if needed

const SoldOrders = () => {
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    // Fetch sold items
    const fetchSoldItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const email = localStorage.getItem("userEmail"); // Retrieve user email from local storage
        if (!email || !token) {
          console.error("User email not found in local storage.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/orders_sold/${email}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          setSoldItems(response.data.soldItems || []);
        } else {
          console.error("Failed to fetch sold items.");
        }
      } catch (error) {
        console.error("Error fetching sold items:", error);
      }
    };

    fetchSoldItems();
  }, []);

  return (
    <div className="sold-orders-container">
      {/* <h2>Sold Items</h2> */}
      {soldItems.length > 0 ? (
        <ul className="sold-orders-list">
          {soldItems.map((item) => (
            <li key={item._id} className="sold-order-card">
              <div className="item-info">
                <h3>{item.item.name}</h3>
                <p>Price: ₹{item.item.price}</p>
                <p>
                  Buyer: {item.buyer.firstName} {item.buyer.lastName}
                </p>
                <p>
                  Sold Date: {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>No items sold yet!!</h2>
      )}
    </div>
  );
};

export default SoldOrders;
